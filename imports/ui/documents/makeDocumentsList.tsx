import React from 'react';

import type PropsOf from '../../util/types/PropsOf';

import {type DocumentDocument} from '../../api/collection/documents';
import type UserFilter from '../../api/query/UserFilter';
import {type Sort} from '../../api/query/sort';
import type GenericQueryHook from '../../api/GenericQueryHook';

import StaticDocumentList from './StaticDocumentList';

type Props = {
	readonly filter?: UserFilter<DocumentDocument>;
	readonly sort: Sort<DocumentDocument>;

	readonly page?: number;
	readonly perpage?: number;
} & Omit<PropsOf<typeof StaticDocumentList>, 'page' | 'perpage' | 'documents'>;

const makeDocumentsList =
	(useDocuments: GenericQueryHook<DocumentDocument>) =>
	({filter = {}, sort, page = 1, perpage = 10, ...rest}: Props) => {
		const query = {
			filter,
			sort,
			projection: StaticDocumentList.projection,
			skip: (page - 1) * perpage,
			limit: perpage,
		};

		const deps = [JSON.stringify(query)];

		const {loading, results: documents} = useDocuments(query, deps);

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

export default makeDocumentsList;
