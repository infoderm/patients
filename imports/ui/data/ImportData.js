import React from 'react';

import Typography from '@material-ui/core/Typography';

import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';

import HealthOneDocumentImportButton from '../documents/HealthOneDocumentImportButton.js';
import DocumentImportButton from '../documents/DocumentImportButton.js';

export default function ImportData() {
	return (
		<div>
			<Typography variant="h3">Lab reports</Typography>
			<HealthOneDocumentImportButton color="primary">
				Import Health One report
				<LibraryBooksIcon />
			</HealthOneDocumentImportButton>
			<DocumentImportButton disabled>
				Import Medar report
				<LibraryBooksIcon />
			</DocumentImportButton>
			<DocumentImportButton disabled>
				Import Medidoc report
				<LibraryBooksIcon />
			</DocumentImportButton>
		</div>
	);
}
