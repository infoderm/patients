import {Meteor} from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import {useSnackbar} from 'notistack';

import Button from '@material-ui/core/Button';
import Dialog from '../modal/OptimizedDialog.js';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
}));

export default function DocumentDeletionDialog({open, onClose, document}) {
	const classes = useStyles();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const deleteThisDocument = (event) => {
		event.preventDefault();
		const key = enqueueSnackbar('Processing...', {variant: 'info'});
		Meteor.call('documents.delete', document._id, (err, _res) => {
			closeSnackbar(key);
			if (err) {
				console.error(err);
				enqueueSnackbar(err.message, {variant: 'error'});
			} else {
				const message = `Document #${document._id} deleted.`;
				console.log(message);
				enqueueSnackbar(message, {variant: 'success'});
				onClose();
			}
		});
	};

	return (
		<Dialog
			open={open}
			component="form"
			aria-labelledby="document-deletion-dialog-title"
			onClose={onClose}
		>
			<DialogTitle id="document-deletion-dialog-title">
				Delete document {document._id.toString()}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to delete this document, click cancel. If you
					really want to delete this document from the system, click the delete
					button.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button type="submit" color="default" onClick={onClose}>
					Cancel
					<CancelIcon className={classes.rightIcon} />
				</Button>
				<Button color="secondary" onClick={deleteThisDocument}>
					Delete
					<DeleteIcon className={classes.rightIcon} />
				</Button>
			</DialogActions>
		</Dialog>
	);
}

DocumentDeletionDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired
};
