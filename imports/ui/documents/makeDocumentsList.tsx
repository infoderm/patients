import assert from 'assert';

import React from 'react';

import {type GridFilterModel, type GridSortModel} from '@mui/x-data-grid';

import escapeStringRegexp from 'escape-string-regexp';

import type PropsOf from '../../util/types/PropsOf';

import {type DocumentDocument} from '../../api/collection/documents';
import type UserFilter from '../../api/query/UserFilter';
import {type Sort} from '../../api/query/sort';
import type GenericQueryHook from '../../api/GenericQueryHook';

import useDataGridModelContextState from '../data-grid/useDataGridModelContextState';

import DataGridModelProvider from '../data-grid/DataGridModelProvider';

import StaticDocumentList from './StaticDocumentList';
import DocumentsTable from './DocumentsTable';

type Props = {
	readonly filter?: UserFilter<DocumentDocument>;
	readonly sort: Sort<DocumentDocument>;

	readonly page?: number;
	readonly perpage?: number;
} & Omit<PropsOf<typeof StaticDocumentList>, 'page' | 'perpage' | 'documents'>;

const _sort = (sortModel: GridSortModel): Sort<DocumentDocument> => {
	assert(sortModel.length === 1);
	return {
		[sortModel[0]!.field]: sortModel[0]!.sort === 'asc' ? 1 : -1,
	} as const;
};

const _filterModelItem = ({
	field,
	operator,
	value,
}: GridFilterModel['items'][number]) => {
	switch (operator) {
		case 'isAnyOf': {
			return value === undefined ? undefined : {[field]: {$in: value}};
		}

		case 'contains': {
			return value === undefined
				? undefined
				: {[field]: {$regex: escapeStringRegexp(value)}};
		}

		case 'equals': {
			return value === undefined ? undefined : {[field]: value};
		}

		case 'startsWith': {
			return value === undefined
				? undefined
				: {[field]: {$regex: `^${escapeStringRegexp(value)}`}};
		}

		case 'endsWith': {
			return value === undefined
				? undefined
				: {[field]: {$regex: `${escapeStringRegexp(value)}$`}};
		}

		case 'isEmpty': {
			return {[field]: ''};
		}

		case 'isNotEmpty': {
			return {[field]: {$ne: ''}};
		}

		default: {
			throw new Error(`Not implemented: ${operator}(${field}, ${value})`);
		}
	}
};

const _filter = ({
	items,
	logicOperator,
}: GridFilterModel): UserFilter<DocumentDocument> | undefined => {
	const op =
		logicOperator === undefined || logicOperator === 'or' ? '$or' : '$and';
	const filters = items.map(_filterModelItem).filter(Boolean);
	return filters.length <= 1
		? filters[0]
		: {
				[op]: filters,
		  };
};

const makeDocumentsList = (
	useDocuments: GenericQueryHook<DocumentDocument>,
) => {
	const DocumentsList = ({
		filter = {},
		sort,
		page = 1,
		perpage = 10,
		...rest
	}: Props) => {
		const {sortModel, filterModel} = useDataGridModelContextState();

		const query = {
			filter: {
				$and: [filter, _filter(filterModel) ?? {}],
			},
			sort: sortModel.length === 0 ? sort : _sort(sortModel),
			projection: StaticDocumentList.projection,
			skip: (page - 1) * perpage,
			limit: perpage,
		};

		const deps = [JSON.stringify(query)];
		console.debug({sortModel, filterModel, query});

		const {loading, results: documents} = useDocuments(query, deps);

		return <DocumentsTable items={documents} />;

		return (
			<StaticDocumentList
				page={page}
				perpage={perpage}
				loading={loading}
				documents={documents}
				{...rest}
			/>
		);
	};

	return (props: Props) => (
		<DataGridModelProvider>
			<DocumentsList {...props} />
		</DataGridModelProvider>
	);
};

export default makeDocumentsList;
