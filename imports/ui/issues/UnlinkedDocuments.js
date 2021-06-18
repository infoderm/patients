import React from 'react';

import {useUnlinkedDocuments} from '../../api/issues';

import DocumentsPage from '../documents/DocumentsPage';

const UnlinkedDocuments = (props) => {
	const options = {
		sort: {
			'patient.lastname': 1,
			'patient.firstname': 1,
			datetime: 1,
			createdAt: 1
		},
		fields: {
			...DocumentsPage.projection
			// patientId: 1,
			// patient: 1,
			// datetime: 1,
			// createdAt: 1
		}
	};

	const {loading, results: documents} = useUnlinkedDocuments({}, options, []);

	if (loading) {
		return <div {...props}>Loading...</div>;
	}

	if (documents.length === 0) {
		return <div {...props}>All documents have an assigned patient :)</div>;
	}

	return (
		<div {...props}>
			<DocumentsPage documents={documents} />
		</div>
	);
};

export default UnlinkedDocuments;
