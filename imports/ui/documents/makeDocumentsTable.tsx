import React from 'react';

import type PropsOf from '../../util/types/PropsOf';

import {type DocumentDocument} from '../../api/collection/documents';
import type UserFilter from '../../api/query/UserFilter';
import {type Sort} from '../../api/query/sort';
import type GenericQueryHook from '../../api/GenericQueryHook';

import useDataGridModelContextState from '../data-grid/useDataGridModelContextState';
import DataGridModelProvider from '../data-grid/DataGridModelProvider';
import {toUserFilter} from '../data-grid/filter/convert';
import {toQuerySort} from '../data-grid/sort/convert';

import Paginator from '../navigation/Paginator';

import StaticDocumentsTable from './StaticDocumentsTable';

type Props = {
	readonly filter?: UserFilter<DocumentDocument>;
	readonly sort: Sort<DocumentDocument>;

	readonly page?: number;
	readonly perpage?: number;
} & Omit<
	PropsOf<typeof StaticDocumentsTable>,
	'page' | 'pageSize' | 'loading' | 'items' | 'showDeleted'
>;

const makeDocumentsTable = (
	useDocuments: GenericQueryHook<DocumentDocument>,
) => {
	const DocumentsTable = ({
		filter = {},
		sort,
		page = 1,
		perpage = 10,
		...rest
	}: Props) => {
		const {sortModel, filterModel} = useDataGridModelContextState();

		const query = {
			filter: {
				$and: [filter, toUserFilter(filterModel) ?? {}],
			},
			sort: toQuerySort(sortModel) ?? sort,
			projection: {
				source: 0,
				decoded: 0,
				results: 0,
				text: 0,
			} as const,
			skip: (page - 1) * perpage,
			limit: perpage,
		};

		const deps = [JSON.stringify(query)];

		const {loading, results: documents} = useDocuments(query, deps);

		return (
			<>
				<StaticDocumentsTable
					loading={Boolean(loading)}
					items={documents}
					page={page - 1}
					pageSize={perpage}
					showDeleted={filter.deleted === undefined}
					{...rest}
				/>
				<Paginator loading={loading} end={documents.length < perpage} />
			</>
		);
	};

	return (props: Props) => (
		<DataGridModelProvider>
			<DocumentsTable {...props} />
		</DataGridModelProvider>
	);
};

export default makeDocumentsTable;
