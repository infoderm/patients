import React from 'react';
import insertDocument from '../../client/insertDocument';
import DocumentImportButton from './DocumentImportButton';

const HealthOneDocumentImportButton = (props) => {
	const onImport = (history, files) => {
		for (const file of files) {
			insertDocument(history, 'healthone', file);
		}
	};

	return <DocumentImportButton onImport={onImport} {...props} />;
};

export default HealthOneDocumentImportButton;
