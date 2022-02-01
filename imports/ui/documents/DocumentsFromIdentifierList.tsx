import React from 'react';
import {useParams} from 'react-router-dom';

import {myDecodeURIComponent} from '../../util/uri';

import StaticDocumentList from './StaticDocumentList';

import useDocuments from './useDocuments';

interface Params {
	identifier: string;
	page?: string;
}

interface Props {
	defaultPage?: number;
	defaultPerpage?: number;
}

const DocumentsFromIdentifierList = ({
	defaultPage = 1,
	defaultPerpage = 10,
}: Props) => {
	const params = useParams<Params>();
	const page = Number.parseInt(params.page, 10) || defaultPage;
	const perpage = defaultPerpage;
	const identifier = myDecodeURIComponent(params.identifier);

	const root = `/documents/${params.identifier}`;

	const query = {identifier};
	const sort = {
		datetime: -1,
	};
	const fields = {
		source: 0,
		decoded: 0,
		results: 0,
		text: 0,
	};
	const options = {
		sort,
		fields,
		skip: (page - 1) * perpage,
		limit: perpage,
	};

	const deps = [JSON.stringify(query), JSON.stringify(options)];
	const {loading, results: documents} = useDocuments(query, options, deps);

	return (
		<StaticDocumentList
			page={page}
			perpage={perpage}
			loading={loading}
			documents={documents}
			root={root}
		/>
	);
};

export default DocumentsFromIdentifierList;
