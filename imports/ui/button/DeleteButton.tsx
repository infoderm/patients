import React from 'react';

import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

import PropsOf from '../../util/PropsOf';

const DeleteButton = (props: PropsOf<typeof Button>) => (
	<Button color="secondary" endIcon={<DeleteIcon />} {...props}>
		Delete
	</Button>
);

export default DeleteButton;
