import React, {useState} from 'react';

import {useSnackbar} from 'notistack';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import SaveIcon from '@mui/icons-material/Save';

import withLazyOpening from '../modal/withLazyOpening';
import call from '../../api/endpoint/call';
import rename from '../../api/endpoint/uploads/rename';
import useUniqueId from '../hooks/useUniqueId';
import CancelButton from '../button/CancelButton';
import debounceSnackbar from '../../util/debounceSnackbar';

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
			const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
			feedback('Saving changes...', {
				variant: 'info',
				persist: true,
			});
			try {
				await call(rename, attachment._id, filename);
				const message = `Attachment ${attachment._id} changed name to ${filename}.`;
				console.log(message);
				feedback(message, {variant: 'success'});
				onClose();
			} catch (error: unknown) {
				console.error({error});
				const message =
					error instanceof Error ? error.message : 'unknown error';
				feedback(message, {variant: 'error'});
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
