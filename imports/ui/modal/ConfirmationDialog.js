import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
}));

const ConfirmationDialog = ({
	open,
	onCancel,
	onConfirm,
	title,
	text,
	cancel,
	confirm
}) => {
	const classes = useStyles();

	return (
		<Dialog open={open} component="form" onClose={onCancel}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText>{text}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button type="submit" color="default" onClick={onCancel}>
					{cancel}
					<CancelIcon className={classes.rightIcon} />
				</Button>
				<Button color="primary" onClick={onConfirm}>
					{confirm}
					<DoneIcon className={classes.rightIcon} />
				</Button>
			</DialogActions>
		</Dialog>
	);
};

ConfirmationDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onCancel: PropTypes.func.isRequired,
	onConfirm: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	cancel: PropTypes.string.isRequired,
	confirm: PropTypes.string.isRequired
};

export default ConfirmationDialog;
