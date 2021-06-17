import {Meteor} from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import {useSnackbar} from 'notistack';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CancelIcon from '@material-ui/icons/Cancel';

import withLazyOpening from '../modal/withLazyOpening.js';
import useIsMounted from '../hooks/useIsMounted.js';

const useStyles = makeStyles((theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
}));

const DocumentSuperDeletionDialog = ({open, onClose, document}) => {
	const classes = useStyles();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const isMounted = useIsMounted();

	const deleteThisDocumentForever = (event) => {
		event.preventDefault();
		const key = enqueueSnackbar('Processing...', {variant: 'info'});
		Meteor.call('documents.superdelete', document._id, (err, _res) => {
			closeSnackbar(key);
			if (err) {
				console.error(err);
				enqueueSnackbar(err.message, {variant: 'error'});
			} else {
				const message = `Document #${document._id} deleted forever.`;
				console.log(message);
				enqueueSnackbar(message, {variant: 'success'});
				if (isMounted()) onClose();
			}
		});
	};

	return (
		<Dialog
			open={open}
			// component="form"
			aria-labelledby="document-super-deletion-dialog-title"
			onClose={onClose}
		>
			<DialogTitle id="document-super-deletion-dialog-title">
				Delete document {document._id.toString()} forever
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to delete this document forever, click cancel. If
					you really want to delete this document from the system forever, click
					the delete button.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button type="submit" color="default" onClick={onClose}>
					Cancel
					<CancelIcon className={classes.rightIcon} />
				</Button>
				<Button color="secondary" onClick={deleteThisDocumentForever}>
					Delete forever
					<DeleteForeverIcon className={classes.rightIcon} />
				</Button>
			</DialogActions>
		</Dialog>
	);
};

DocumentSuperDeletionDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired
};

export default withLazyOpening(DocumentSuperDeletionDialog);
