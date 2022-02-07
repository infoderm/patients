import React from 'react';

import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

import PropsOf from '../../util/PropsOf';

const DeleteButton = (props: PropsOf<typeof Button>) => (
	<Button color="secondary" endIcon={<DeleteIcon />} {...props}>
		Delete
	</Button>
);

export default DeleteButton;
