import React from 'react';

import {match} from 'react-router-dom';

import {myDecodeURIComponent} from '../../client/uri';

import StaticDocumentList from './StaticDocumentList';

import useDocuments from './useDocuments';

interface Params {
	page: string;
	identifier: string;
	reference: string;
}

interface Props {
	match: match<Params>;
	page?: number;
	perpage?: number;
}

const DocumentsVersionsList = ({match, page = 1, perpage = 10}: Props) => {
	page = (match.params.page && Number.parseInt(match.params.page, 10)) || page;
	const identifier = myDecodeURIComponent(match.params.identifier);
	const reference = myDecodeURIComponent(match.params.reference);

	const root = `/document/versions/${match.params.identifier}/${match.params.reference}`;

	const query = {identifier, reference};
	const sort = {
		status: 1,
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

export default DocumentsVersionsList;
