import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import CancelIcon from '@material-ui/icons/Cancel';

const InformationDialog = ({open, onClose, title, text, close, CloseIcon}) => (
	<Dialog open={open} /* component="form" */ onClose={onClose}>
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

InformationDialog.defaultProps = {
	open: false,
	CloseIcon: CancelIcon
};

InformationDialog.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
	close: PropTypes.string.isRequired,
	CloseIcon: PropTypes.elementType
};

export default InformationDialog;
