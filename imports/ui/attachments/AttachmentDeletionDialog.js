import {Meteor} from 'meteor/meteor';

import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import {useSnackbar} from 'notistack';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '../modal/OptimizedDialog.js';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

import {normalized} from '../../api/string.js';

const useStyles = makeStyles((theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
}));

export default function AttachmentDeletionDialog(props) {
	const {open, onClose, detach, itemId, attachment} = props;

	const classes = useStyles();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [filename, setFilename] = useState('');
	const [filenameError, setFilenameError] = useState('');

	const trashAttachment = (attachment) => {
		Meteor.call('uploads.remove', attachment._id, (err) => {
			if (err) {
				const message = `[Trash] Error during removal: ${err.message}`;
				console.error(message, err);
			} else {
				const message = '[Trash] File removed from DB and FS';
				console.log(message);
			}
		});
	};

	const deleteThisAttachmentIfLastNameMatches = (event) => {
		event.preventDefault();
		if (normalized(filename) === normalized(attachment.name)) {
			setFilenameError('');
			const key = enqueueSnackbar('Processing...', {variant: 'info'});
			Meteor.call(detach, itemId, attachment._id, (err, _res) => {
				closeSnackbar(key);
				if (err) {
					console.error(err);
					enqueueSnackbar(err.message, {variant: 'error'});
				} else {
					const message = `[Detach] Attachment ${attachment.name} deleted with ${detach}(${itemId}).`;
					console.log(message);
					enqueueSnackbar(message, {variant: 'success'});
					onClose();
					trashAttachment(attachment);
				}
			});
		} else {
			setFilenameError('Last names do not match');
		}
	};

	return (
		<Dialog
			open={open}
			component="form"
			aria-labelledby="attachment-deletion-dialog-title"
			onClose={onClose}
		>
			<DialogTitle id="attachment-deletion-dialog-title">
				Delete attachment {attachment.name}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to delete this attachment, click cancel. If you
					really want to delete this attachment from the system, enter its
					filename below and click the delete button.
				</DialogContentText>
				<TextField
					autoFocus
					fullWidth
					margin="dense"
					label="Attachment's filename"
					value={filename}
					helperText={filenameError}
					error={Boolean(filenameError)}
					onChange={(e) => setFilename(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button type="submit" color="default" onClick={onClose}>
					Cancel
					<CancelIcon className={classes.rightIcon} />
				</Button>
				<Button
					color="secondary"
					onClick={deleteThisAttachmentIfLastNameMatches}
				>
					Delete
					<DeleteIcon className={classes.rightIcon} />
				</Button>
			</DialogActions>
		</Dialog>
	);
}

AttachmentDeletionDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	detach: PropTypes.string.isRequired,
	itemId: PropTypes.string.isRequired,
	attachment: PropTypes.object.isRequired
};
