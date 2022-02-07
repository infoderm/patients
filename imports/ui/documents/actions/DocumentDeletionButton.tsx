import React from 'react';

import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

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
