import {Meteor} from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import {useSnackbar} from 'notistack';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';

const DocumentDeletionDialog = ({open, onClose, document}) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const isMounted = useIsMounted();

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
				if (isMounted()) onClose();
			}
		});
	};

	return (
		<Dialog
			open={open}
			// component="form"
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
				<Button
					type="submit"
					color="default"
					endIcon={<CancelIcon />}
					onClick={onClose}
				>
					Cancel
				</Button>
				<Button
					color="secondary"
					endIcon={<DeleteIcon />}
					onClick={deleteThisDocument}
				>
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
};

DocumentDeletionDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default withLazyOpening(DocumentDeletionDialog);
