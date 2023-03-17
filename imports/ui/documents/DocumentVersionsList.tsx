import React from 'react';
import {useParams} from 'react-router-dom';

import {myDecodeURIComponent} from '../../lib/uri';

import StaticDocumentList from './StaticDocumentList';

import useDocuments from './useDocuments';

type Params = {
	identifier: string;
	reference: string;
};

type Props = {
	page?: number;
	perpage?: number;
};

const DocumentsVersionsList = ({page = 1, perpage = 10}: Props) => {
	const params = useParams<Params>();
	const identifier = myDecodeURIComponent(params.identifier);
	const reference = myDecodeURIComponent(params.reference);

	const filter = {identifier, reference};
	const sort = {
		status: 1,
		datetime: -1,
	} as const;
	const projection = {
		source: 0,
		decoded: 0,
		results: 0,
		text: 0,
	} as const;
	const query = {
		filter,
		sort,
		projection,
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
		/>
	);
};

export default DocumentsVersionsList;
