import React from 'react';

import useDocuments from '../../api/hooks/useDocuments.js';

import DocumentsPage from '../documents/DocumentsPage.js';

const UnparsedDocuments = (props) => {
	const query = {
		parsed: false
	};

	const options = {
		sort: {
			createdAt: 1
		},
		fields: {
			...DocumentsPage.projection
			// parsed: 1
		}
	};

	const {loading, results: documents} = useDocuments(query, options, []);

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
