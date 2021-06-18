import React from 'react';

import {useMangledDocuments} from '../../api/issues';

import DocumentsPage from '../documents/DocumentsPage';

const MangledDocuments = (props) => {
	const options = {
		sort: {
			createdAt: 1
		},
		fields: {
			...DocumentsPage.projection
			// encoding: 1,
			// createdAt: 1
		}
	};

	const {loading, results: documents} = useMangledDocuments({}, options, []);

	if (loading) {
		return <div {...props}>Loading...</div>;
	}

	if (documents.length === 0) {
		return <div {...props}>All documents have been decoded :)</div>;
	}

	return (
		<div {...props}>
			<DocumentsPage documents={documents} />
		</div>
	);
};

export default MangledDocuments;
