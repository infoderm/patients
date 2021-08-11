import React from 'react';

import {useUnparsedDocuments} from '../../api/issues';

import DocumentsPage from '../documents/DocumentsPage';

const UnparsedDocuments = (props) => {
	const options = {
		sort: {
			createdAt: 1,
		},
		fields: {
			...DocumentsPage.projection,
			// parsed: 1,
			// createdAt: 1
		},
	};

	const {loading, results: documents} = useUnparsedDocuments({}, options, []);

	if (loading) {
		return <div {...props}>Loading...</div>;
	}

	if (documents.length === 0) {
		return <div {...props}>All documents have been parsed :)</div>;
	}

	return (
		<div {...props}>
			<DocumentsPage documents={documents} />
		</div>
	);
};

export default UnparsedDocuments;
