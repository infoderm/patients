import React, {ElementType, MouseEventHandler, useState} from 'react';

import Button, {ButtonProps} from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import DefaultConfirmIcon from '@mui/icons-material/Done';
import DefaultCancelIcon from '@mui/icons-material/Cancel';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';

import {formattedLineInput} from '../../api/string';

type EventHandler = MouseEventHandler<HTMLButtonElement>;

export interface ConfirmationDialogProps {
	open?: boolean;
	loading?: boolean;
	pending?: boolean;
	onCancel: EventHandler;
	onConfirm: (value: string) => void;
	text: string | JSX.Element;
	CancelIcon?: ElementType;
	ConfirmIcon?: ElementType;
	cancelColor?: ButtonProps['color'];
	confirmColor?: ButtonProps['color'];
	initialValue: string;
}

const ConfirmationDialog = ({
	open = false,
	pending = false,
	onCancel,
	onConfirm,
	text,
	CancelIcon = DefaultCancelIcon,
	ConfirmIcon = DefaultConfirmIcon,
	cancelColor = undefined,
	confirmColor = 'primary',
	initialValue,
}: ConfirmationDialogProps) => {
	const [value, setValue] = useState(initialValue);
	return (
		<Dialog open={open} onClose={onCancel}>
			<DialogTitle>Edit</DialogTitle>
			<DialogContent>
				<DialogContentText>{text}</DialogContentText>
				<TextField
					autoFocus
					fullWidth
					margin="dense"
					label="Comment"
					value={value}
					onChange={({target}: React.ChangeEvent<HTMLInputElement>) => {
						setValue(formattedLineInput(target.value));
					}}
				/>
			</DialogContent>
			<DialogActions>
				<Button
					disabled={pending}
					color={cancelColor}
					endIcon={<CancelIcon />}
					onClick={onCancel}
				>
					Cancel
				</Button>
				<LoadingButton
					disabled={value.trimEnd() === initialValue}
					color={confirmColor}
					endIcon={<ConfirmIcon />}
					loading={pending}
					loadingPosition="end"
					onClick={() => {
						onConfirm(value.trimEnd());
					}}
				>
					Save
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmationDialog;
