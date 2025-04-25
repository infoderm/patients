import React from 'react';

import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

import type PropsOf from '../../../util/types/PropsOf';

import DocumentDeletionGenericButton from './DocumentDeletionGenericButton';

type Props = Omit<
	PropsOf<typeof DocumentDeletionGenericButton>,
	'component' | 'endIcon'
>;

const DocumentDeletionButton = (props: Props) => (
	<DocumentDeletionGenericButton
		component={Button}
		endIcon={<DeleteIcon />}
		{...props}
	>
		Delete
	</DocumentDeletionGenericButton>
);

export default DocumentDeletionButton;
