import {Meteor} from 'meteor/meteor';

import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import {useSnackbar} from 'notistack';

import Dialog from '../modal/OptimizedDialog.js';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import Button from '@material-ui/core/Button';

import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import AssignmentIcon from '@material-ui/icons/Assignment';

import AttachmentThumbnail from './AttachmentThumbnail.js';

import {normalized} from '../../api/string.js';

const useStyles = makeStyles((theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	},
	thumbnail: {
		height: 300
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

	const deleteThisAttachmentIfAttachmentNameMatches = (event) => {
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
			setFilenameError('Attachment names do not match');
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
				<AttachmentThumbnail
					className={classes.thumbnail}
					height="600"
					attachmentId={attachment._id}
				/>
				<FormControl fullWidth margin="dense">
					<InputLabel error={Boolean(filenameError)}>
						Attachment&apos;s filename
					</InputLabel>
					<Input
						autoFocus
						value={filename}
						error={Boolean(filenameError)}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="autofill filename check"
									onClick={() => {
										setFilename(attachment.name);
										setFilenameError('');
									}}
									onMouseDown={(e) => e.preventDefault()}
								>
									<AssignmentIcon />
								</IconButton>
							</InputAdornment>
						}
						onChange={(e) => setFilename(e.target.value)}
					/>
					<FormHelperText error={Boolean(filenameError)}>
						{filenameError}
					</FormHelperText>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button type="submit" color="default" onClick={onClose}>
					Cancel
					<CancelIcon className={classes.rightIcon} />
				</Button>
				<Button
					color="secondary"
					onClick={deleteThisAttachmentIfAttachmentNameMatches}
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
