import {Meteor} from 'meteor/meteor';

import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import {useSnackbar} from 'notistack';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';

import withLazyOpening from '../modal/withLazyOpening';

const useStyles = makeStyles((theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1),
	},
}));

const AttachmentEditionDialog = ({open, onClose, attachment}) => {
	const classes = useStyles();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [filename, setFilename] = useState(attachment.name || '');
	const [filenameError, setFilenameError] = useState('');

	const editThisAttachment = (event) => {
		event.preventDefault();
		if (filename === '') {
			setFilenameError('Filename cannot be empty');
		} else {
			setFilenameError('');
			const key = enqueueSnackbar('Saving changes...', {
				variant: 'info',
				persist: true,
			});
			Meteor.call(
				'uploads.updateFilename',
				attachment._id,
				filename,
				(err, _res) => {
					closeSnackbar(key);
					if (err) {
						console.error(err);
						enqueueSnackbar(err.message, {variant: 'error'});
					} else {
						const message = `Attachment ${attachment._id} changed name to ${filename}.`;
						console.log(message);
						enqueueSnackbar(message, {variant: 'success'});
						onClose();
					}
				},
			);
		}
	};

	return (
		<Dialog
			open={open}
			// component="form"
			aria-labelledby="attachment-edition-dialog-title"
			onClose={onClose}
		>
			<DialogTitle id="attachment-edition-dialog-title">
				Edit attachment {attachment.name}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					You can edit the attachment&apos;s file name.
				</DialogContentText>
				<TextField
					autoFocus
					fullWidth
					margin="dense"
					label="Filename"
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
				<Button color="primary" onClick={editThisAttachment}>
					Save Changes
					<SaveIcon className={classes.rightIcon} />
				</Button>
			</DialogActions>
		</Dialog>
	);
};

AttachmentEditionDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	attachment: PropTypes.object.isRequired,
};

export default withLazyOpening(AttachmentEditionDialog);
