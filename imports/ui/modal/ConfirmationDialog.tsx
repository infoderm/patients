import React, {ElementType, MouseEventHandler} from 'react';

import {PropTypes as MuiPropTypes} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';

import DefaultConfirmIcon from '@material-ui/icons/Done';
import DefaultCancelIcon from '@material-ui/icons/Cancel';

type EventHandler = MouseEventHandler<HTMLButtonElement>;

export interface ConfirmationDialogProps {
	open?: boolean;
	loading?: boolean;
	pending?: boolean;
	onCancel: EventHandler;
	onConfirm: EventHandler;
	title: string;
	text: string | JSX.Element;
	cancel: string;
	confirm: string;
	CancelIcon?: ElementType;
	ConfirmIcon?: ElementType;
	cancelColor?: MuiPropTypes.Color;
	confirmColor?: MuiPropTypes.Color;
}

const ConfirmationDialog = ({
	open = false,
	loading = false,
	pending = false,
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
}: ConfirmationDialogProps) => (
	<Dialog open={open} onClose={onCancel}>
		{loading && <LinearProgress />}
		<DialogTitle>{title}</DialogTitle>
		<DialogContent>
			<DialogContentText>{text}</DialogContentText>
		</DialogContent>
		<DialogActions>
			<Button
				disabled={pending}
				color={cancelColor}
				endIcon={<CancelIcon />}
				onClick={onCancel}
			>
				{cancel}
			</Button>
			<Button
				disabled={pending}
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
