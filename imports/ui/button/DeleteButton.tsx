import React from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';

import PropsOf from '../../util/PropsOf';

const DeleteButton = (props: PropsOf<typeof LoadingButton>) => (
	<LoadingButton
		color="secondary"
		endIcon={<DeleteIcon />}
		loadingPosition="end"
		{...props}
	>
		Delete
	</LoadingButton>
);

export default DeleteButton;
