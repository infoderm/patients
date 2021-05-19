import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';

const ConfirmationDialog = ({
	open,
	onCancel,
	onConfirm,
	title,
	text,
	cancel,
	confirm,
	CancelIcon,
	ConfirmIcon,
	cancelColor,
	confirmColor
}) => (
	<Dialog open={open} component="form" onClose={onCancel}>
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

ConfirmationDialog.defaultProps = {
	open: false,
	CancelIcon,
	ConfirmIcon: DoneIcon,
	cancelColor: 'default',
	confirmColor: 'primary'
};

ConfirmationDialog.propTypes = {
	open: PropTypes.bool,
	onCancel: PropTypes.func.isRequired,
	onConfirm: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	cancel: PropTypes.string.isRequired,
	confirm: PropTypes.string.isRequired,
	CancelIcon: PropTypes.elementType,
	ConfirmIcon: PropTypes.elementType,
	cancelColor: PropTypes.string,
	confirmColor: PropTypes.string
};

export default ConfirmationDialog;
