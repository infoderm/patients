import React from 'react';

import paged from '../routes/paged';

import FixedFab from '../button/FixedFab';

import DocumentsList from './DocumentsList';

import CustomDocumentImportButton from './CustomDocumentImportButton';
import DocumentsListAutoFilterToggleButton from './DocumentsListAutoFilterToggleButton';
import useDocumentsListAutoFilter from './useDocumentsListAutoFilter';

const DocumentsPager = paged(DocumentsList);

const DocumentsListRoutes = () => {
	const [filter, toggleFilter] = useDocumentsListAutoFilter();

	return (
		<>
			<DocumentsPager filter={filter} sort={{createdAt: -1}} />
			<CustomDocumentImportButton
				Button={FixedFab}
				col={4}
				tooltip="Import documents"
			/>
			<DocumentsListAutoFilterToggleButton
				filter={filter}
				onClick={toggleFilter}
			/>
		</>
	);
};

export default DocumentsListRoutes;
