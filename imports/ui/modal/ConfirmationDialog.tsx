import React, {type ElementType, type MouseEventHandler} from 'react';

import Button, {type ButtonProps} from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';

import DefaultConfirmIcon from '@mui/icons-material/Done';
import DefaultCancelIcon from '@mui/icons-material/Cancel';
import LoadingButton from '@mui/lab/LoadingButton';

type EventHandler = MouseEventHandler<HTMLButtonElement>;

export type ConfirmationDialogProps = {
	readonly open?: boolean;
	readonly loading?: boolean;
	readonly pending?: boolean;
	readonly onCancel: EventHandler;
	readonly onConfirm: EventHandler;
	readonly title: string;
	readonly text: string | JSX.Element;
	readonly cancel: string;
	readonly confirm: string;
	readonly CancelIcon?: ElementType;
	readonly ConfirmIcon?: ElementType;
	readonly cancelColor?: ButtonProps['color'];
	readonly confirmColor?: ButtonProps['color'];
};

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
	cancelColor = undefined,
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
				disabled={loading || pending}
				color={cancelColor}
				endIcon={<CancelIcon />}
				onClick={onCancel}
			>
				{cancel}
			</Button>
			<LoadingButton
				disabled={loading}
				color={confirmColor}
				endIcon={<ConfirmIcon />}
				loading={pending}
				loadingPosition="end"
				onClick={onConfirm}
			>
				{confirm}
			</LoadingButton>
		</DialogActions>
	</Dialog>
);

export default ConfirmationDialog;
