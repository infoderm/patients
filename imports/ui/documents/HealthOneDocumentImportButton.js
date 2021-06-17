import React from 'react';
import insertDocument from '../../client/insertDocument.js';
import DocumentImportButton from './DocumentImportButton.js';

const HealthOneDocumentImportButton = (props) => {
	const onImport = (history, files) => {
		for (const file of files) {
			insertDocument(history, 'healthone', file);
		}
	};

	return <DocumentImportButton onImport={onImport} {...props} />;
};

export default HealthOneDocumentImportButton;
