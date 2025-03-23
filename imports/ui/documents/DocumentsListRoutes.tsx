import React from 'react';

import paged from '../routes/paged';

import FixedFab from '../button/FixedFab';

import DocumentsList from './DocumentsList';

import CustomDocumentImportButton from './CustomDocumentImportButton';

const DocumentsPager = paged(DocumentsList);

const DocumentsListRoutes = () => (
	<>
		<DocumentsPager sort={{createdAt: -1}} />
		<CustomDocumentImportButton
			Button={FixedFab}
			col={4}
			tooltip="Import documents"
		/>
	</>
);

export default DocumentsListRoutes;
