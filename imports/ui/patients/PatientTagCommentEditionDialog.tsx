import React, {type ElementType, type MouseEventHandler, useState} from 'react';

import Button, {type ButtonProps} from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import DefaultConfirmIcon from '@mui/icons-material/Done';
import DefaultCancelIcon from '@mui/icons-material/Cancel';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

import {formattedLineInput} from '../../api/string';

type EventHandler = MouseEventHandler<HTMLButtonElement>;

export type ConfirmationDialogProps = {
	open?: boolean;
	pending?: boolean;
	onCancel: EventHandler;
	onConfirm: (value: string) => void;
	text: string | JSX.Element;
	CancelIcon?: ElementType;
	ConfirmIcon?: ElementType;
	cancelColor?: ButtonProps['color'];
	confirmColor?: ButtonProps['color'];
	initialValue: string;
};

const emptyInput = formattedLineInput('');

const PatientTagCommentEditionDialog = ({
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
	const onClear = () => {
		setValue(emptyInput);
	};

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
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								{value === emptyInput ? null : (
									<IconButton
										size="small"
										aria-label="clear"
										onClick={onClear}
										onMouseDown={(e) => {
											e.preventDefault();
										}}
									>
										<ClearIcon />
									</IconButton>
								)}
							</InputAdornment>
						),
					}}
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

export default PatientTagCommentEditionDialog;
