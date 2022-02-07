import React, {useState} from 'react';

import {useSnackbar} from 'notistack';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import SaveIcon from '@material-ui/icons/Save';

import withLazyOpening from '../modal/withLazyOpening';
import call from '../../api/endpoint/call';
import rename from '../../api/endpoint/uploads/rename';
import useUniqueId from '../hooks/useUniqueId';
import CancelButton from '../button/CancelButton';

interface Props {
	open: boolean;
	onClose: () => void;
	attachment: {_id: string; name: string};
}

const AttachmentEditionDialog = ({open, onClose, attachment}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [filename, setFilename] = useState(attachment.name || '');
	const [filenameError, setFilenameError] = useState('');

	const editThisAttachment = async (event) => {
		event.preventDefault();
		if (filename === '') {
			setFilenameError('Filename cannot be empty');
		} else {
			setFilenameError('');
			const key = enqueueSnackbar('Saving changes...', {
				variant: 'info',
				persist: true,
			});
			try {
				await call(rename, attachment._id, filename);
				closeSnackbar(key);
				const message = `Attachment ${attachment._id} changed name to ${filename}.`;
				console.log(message);
				enqueueSnackbar(message, {variant: 'success'});
				onClose();
			} catch (error: unknown) {
				closeSnackbar(key);
				console.error({error});
				const message =
					error instanceof Error ? error.message : 'unknown error';
				enqueueSnackbar(message, {variant: 'error'});
			}
		}
	};

	const titleId = useUniqueId('attachment-edition-dialog-title');

	return (
		<Dialog open={open} aria-labelledby={titleId} onClose={onClose}>
			<DialogTitle id={titleId}>Edit attachment {attachment.name}</DialogTitle>
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
					onChange={(e) => {
						setFilename(e.target.value);
					}}
				/>
			</DialogContent>
			<DialogActions>
				<CancelButton onClick={onClose} />
				<Button
					color="primary"
					endIcon={<SaveIcon />}
					onClick={editThisAttachment}
				>
					Save Changes
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default withLazyOpening(AttachmentEditionDialog);
