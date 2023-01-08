import React from 'react';
import {useParams} from 'react-router-dom';

import {myDecodeURIComponent} from '../../util/uri';

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
		/>
	);
};

export default DocumentsVersionsList;
