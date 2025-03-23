import React, {type DependencyList} from 'react';

import FixedFab from '../button/FixedFab';

import type UserQuery from '../../api/query/UserQuery';
import {type DocumentDocument} from '../../api/collection/documents';
import type UserFilter from '../../api/query/UserFilter';
import {type Sort} from '../../api/query/sort';
import type PropsOf from '../../util/types/PropsOf';

import CustomDocumentImportButton from './CustomDocumentImportButton';
import StaticDocumentList from './StaticDocumentList';

type Props = {
	readonly filter?: UserFilter<DocumentDocument>;
	readonly sort: Sort<DocumentDocument>;

	readonly page?: number;
	readonly perpage?: number;
} & Omit<PropsOf<typeof StaticDocumentList>, 'page' | 'perpage' | 'documents'>;

type Hook<T> = (
	query: UserQuery<T>,
	deps: DependencyList,
) => {loading: boolean; results: T[]};

const makeDocumentsList =
	(useDocuments: Hook<DocumentDocument>) =>
	({filter = {}, sort, page = 1, perpage = 10, ...rest}: Props) => {
		const query = {
			filter,
			sort,
			projection: StaticDocumentList.projection,
			skip: (page - 1) * perpage,
			limit: perpage,
		};

		const deps = [page, perpage];

		const {loading, results: documents} = useDocuments(query, deps);

		return (
			<>
				<StaticDocumentList
					page={page}
					perpage={perpage}
					loading={loading}
					documents={documents}
					{...rest}
				/>
				<CustomDocumentImportButton
					Button={FixedFab}
					col={4}
					tooltip="Import documents"
				/>
			</>
		);
	};

export default makeDocumentsList;
