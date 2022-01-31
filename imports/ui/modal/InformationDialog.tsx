import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import CancelIcon from '@material-ui/icons/Cancel';

interface Props {
	open?: boolean;
	onClose: () => void;
	title: string;
	text: string | JSX.Element;
	close: string;
	CloseIcon: React.ElementType;
}

const InformationDialog = ({
	open = false,
	onClose,
	title,
	text,
	close,
	CloseIcon = CancelIcon,
}: Props) => (
	<Dialog open={open} onClose={onClose}>
		<DialogTitle>{title}</DialogTitle>
		<DialogContent>
			<DialogContentText>{text}</DialogContentText>
		</DialogContent>
		<DialogActions>
			<Button
				type="submit"
				color="default"
				endIcon={<CloseIcon />}
				onClick={onClose}
			>
				{close}
			</Button>
		</DialogActions>
	</Dialog>
);

export default InformationDialog;
