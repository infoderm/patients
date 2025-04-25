import React from 'react';

import Button from '@mui/material/Button';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';

import type PropsOf from '../../../util/types/PropsOf';

import DocumentRestorationGenericButton from './DocumentRestorationGenericButton';

type Props = Omit<
	PropsOf<typeof DocumentRestorationGenericButton>,
	'component' | 'endIcon'
>;

const DocumentRestorationButton = (props: Props) => (
	<DocumentRestorationGenericButton
		component={Button}
		endIcon={<RestoreFromTrashIcon />}
		{...props}
	>
		Restore
	</DocumentRestorationGenericButton>
);

export default DocumentRestorationButton;
