import React from 'react';

import List from '@mui/material/List';

import {type DocumentDocument} from '../../api/collection/documents';

import DocumentListItem from './DocumentListItem';

type Props = {
	loading?: boolean;
	documents: DocumentDocument[];
};

const DocumentsPage = ({loading = false, documents}: Props) => {
	return (
		<List>
			{documents.map((document) => (
				<DocumentListItem
					key={document._id}
					loading={loading}
					document={document}
				/>
			))}
		</List>
	);
};

DocumentsPage.projection = DocumentListItem.projection;

export default DocumentsPage;
