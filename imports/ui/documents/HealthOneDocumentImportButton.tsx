import React from 'react';
import insertDocument from '../../api/documents/insertDocument';
import DocumentImportButton from './DocumentImportButton';

const HealthOneDocumentImportButton = (props) => {
	const onImport = async (history, files) => {
		return Promise.all(
			files.map(async (file) => insertDocument(history, 'healthone', file)),
		);
	};

	return <DocumentImportButton onImport={onImport} {...props} />;
};

export default HealthOneDocumentImportButton;
