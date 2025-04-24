import React from 'react';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import type PropsOf from '../../../util/types/PropsOf';

import DocumentDeletionGenericButton from './DocumentDeletionGenericButton';

type Props = Omit<
	PropsOf<typeof DocumentDeletionGenericButton>,
	'component' | 'size'
>;

const DocumentDeletionIconButton = (props: Props) => (
	<DocumentDeletionGenericButton component={IconButton} size="large" {...props}>
		<DeleteIcon />
	</DocumentDeletionGenericButton>
);

export default DocumentDeletionIconButton;
