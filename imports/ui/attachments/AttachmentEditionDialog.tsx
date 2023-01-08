import React, {useState} from 'react';

import {useSnackbar} from 'notistack';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

import withLazyOpening from '../modal/withLazyOpening';
import rename from '../../api/endpoint/uploads/rename';
import CancelButton from '../button/CancelButton';
import debounceSnackbar from '../../util/debounceSnackbar';
import useCall from '../action/useCall';

type Props = {
	open: boolean;
	onClose: () => void;
	attachment: {_id: string; name: string};
};

const AttachmentEditionDialog = ({open, onClose, attachment}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [filename, setFilename] = useState(attachment.name || '');
	const [filenameError, setFilenameError] = useState('');
	const [call, {pending}] = useCall();

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

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Edit attachment {attachment.name}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					You can edit the attachment&apos;s file name.
				</DialogContentText>
				<TextField
					autoFocus
					fullWidth
					disabled={pending}
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
				<CancelButton disabled={pending} onClick={onClose} />
				<LoadingButton
					color="primary"
					loading={pending}
					endIcon={<SaveIcon />}
					loadingPosition="end"
					onClick={editThisAttachment}
				>
					Save Changes
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
};

export default withLazyOpening(AttachmentEditionDialog);
