import React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import CancelIcon from '@mui/icons-material/Cancel';

type Props = {
	readonly open?: boolean;
	readonly onClose: () => void;
	readonly title: string;
	readonly text: string | JSX.Element;
	readonly close: string;
	readonly CloseIcon: React.ElementType;
};

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
			<Button endIcon={<CloseIcon />} onClick={onClose}>
				{close}
			</Button>
		</DialogActions>
	</Dialog>
);

export default InformationDialog;
