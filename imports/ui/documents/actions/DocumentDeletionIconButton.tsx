import React from 'react';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import DocumentDeletionGenericButton from './DocumentDeletionGenericButton';

const DocumentDeletionIconButton = (props) => (
	<DocumentDeletionGenericButton component={IconButton} size="large" {...props}>
		<DeleteIcon />
	</DocumentDeletionGenericButton>
);

export default DocumentDeletionIconButton;
