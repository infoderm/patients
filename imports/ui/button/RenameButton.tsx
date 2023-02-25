import React from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import EditIcon from '@mui/icons-material/Edit';

import type PropsOf from '../../lib/types/PropsOf';

const RenameButton = (props: PropsOf<typeof LoadingButton>) => (
	<LoadingButton
		color="secondary"
		endIcon={<EditIcon />}
		loadingPosition="end"
		{...props}
	>
		Rename
	</LoadingButton>
);

export default RenameButton;
