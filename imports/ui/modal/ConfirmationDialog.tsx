import React, {ElementType} from 'react';

import {PropTypes as MuiPropTypes} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DefaultConfirmIcon from '@material-ui/icons/Done';
import DefaultCancelIcon from '@material-ui/icons/Cancel';

interface Props {
	open?: boolean;
	onCancel: () => void;
	onConfirm: () => void;
	title: string;
	text: string;
	cancel: string;
	confirm: string;
	CancelIcon?: ElementType;
	ConfirmIcon?: ElementType;
	cancelColor?: MuiPropTypes.Color;
	confirmColor?: MuiPropTypes.Color;
}

const ConfirmationDialog = ({
	open = false,
	onCancel,
	onConfirm,
	title,
	text,
	cancel,
	confirm,
	CancelIcon = DefaultCancelIcon,
	ConfirmIcon = DefaultConfirmIcon,
	cancelColor = 'default',
	confirmColor = 'primary',
}: Props) => (
	<Dialog open={open} /* component="form" */ onClose={onCancel}>
		<DialogTitle>{title}</DialogTitle>
		<DialogContent>
			<DialogContentText>{text}</DialogContentText>
		</DialogContent>
		<DialogActions>
			<Button
				type="submit"
				color={cancelColor}
				endIcon={<CancelIcon />}
				onClick={onCancel}
			>
				{cancel}
			</Button>
			<Button
				color={confirmColor}
				endIcon={<ConfirmIcon />}
				onClick={onConfirm}
			>
				{confirm}
			</Button>
		</DialogActions>
	</Dialog>
);

export default ConfirmationDialog;
