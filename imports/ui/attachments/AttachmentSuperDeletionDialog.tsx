import React, {useState} from 'react';

import {styled} from '@mui/material/styles';
import {useSnackbar} from 'notistack';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import LoadingButton from '@mui/lab/LoadingButton';

import {Uploads} from '../../api/uploads';
import {normalizedLine} from '../../api/string';

import CancelButton from '../button/CancelButton';

import ConfirmationTextField, {
	useConfirmationTextFieldState,
} from '../input/ConfirmationTextField';

import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';
import debounceSnackbar from '../snackbar/debounceSnackbar';

import AttachmentThumbnail from './AttachmentThumbnail';

const Thumbnail = styled(AttachmentThumbnail)({
	height: 300,
});

type Props = {
	readonly open: boolean;
	readonly onClose: () => void;
	readonly attachment: {_id: string; name: string};
};

const AttachmentSuperDeletionDialog = ({open, onClose, attachment}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [pending, setPending] = useState(false);

	const getError = (expected: string, value: string) =>
		normalizedLine(expected) === normalizedLine(value)
			? ''
			: 'Attachment names do not match';

	const {validate, props: ConfirmationTextFieldProps} =
		useConfirmationTextFieldState(attachment.name, getError);

	const isMounted = useIsMounted();

	const trashThisAttachmentIfAttachmentNameMatches = (event) => {
		event.preventDefault();
		if (validate()) {
			const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
			feedback('Processing...', {variant: 'info', persist: true});
			setPending(true);
			Uploads.removeAsync({_id: attachment._id}).then(
				() => {
					setPending(false);
					const message = '[Trash] File removed from DB and FS';
					console.log(message);
					feedback(message, {variant: 'success'});
					if (isMounted()) onClose();
				},
				(error) => {
					setPending(false);
					const message = `[Trash] Error during removal: ${error.message}`;
					console.error(message, {err: error});
					feedback(message, {variant: 'error'});
				},
			);
		}
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Delete attachment {attachment.name}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to delete this attachment, click cancel. If you
					really want to delete this attachment from the system, enter its
					filename below and click the delete button.
				</DialogContentText>
				<Thumbnail width={550} height={300} attachmentId={attachment._id} />
				<ConfirmationTextField
					fullWidth
					autoFocus
					disabled={pending}
					margin="dense"
					label="Attachment's filename"
					{...ConfirmationTextFieldProps}
				/>
			</DialogContent>
			<DialogActions>
				<CancelButton disabled={pending} onClick={onClose} />
				<LoadingButton
					color="secondary"
					disabled={ConfirmationTextFieldProps.error}
					loading={pending}
					endIcon={<DeleteForeverIcon />}
					loadingPosition="end"
					onClick={trashThisAttachmentIfAttachmentNameMatches}
				>
					Delete forever
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
};

export default withLazyOpening(AttachmentSuperDeletionDialog);
