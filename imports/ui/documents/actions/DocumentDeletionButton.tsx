import React from 'react';

import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

import DocumentDeletionGenericButton from './DocumentDeletionGenericButton';

const DocumentDeletionButton = (props) => (
	<DocumentDeletionGenericButton
		component={Button}
		endIcon={<DeleteIcon />}
		{...props}
	>
		Delete
	</DocumentDeletionGenericButton>
);

export default DocumentDeletionButton;
