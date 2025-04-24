import React from 'react';

import Button from '@mui/material/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import type PropsOf from '../../../util/types/PropsOf';

import DocumentSuperDeletionGenericButton from './DocumentSuperDeletionGenericButton';

type Props = Omit<
	PropsOf<typeof DocumentSuperDeletionGenericButton>,
	'component' | 'endIcon'
>;

const DocumentSuperDeletionButton = (props: Props) => (
	<DocumentSuperDeletionGenericButton
		component={Button}
		endIcon={<DeleteForeverIcon />}
		{...props}
	>
		Delete forever
	</DocumentSuperDeletionGenericButton>
);

export default DocumentSuperDeletionButton;
