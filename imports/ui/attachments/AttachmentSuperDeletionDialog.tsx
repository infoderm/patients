import React from 'react';

import {styled} from '@mui/material/styles';
import {useSnackbar} from 'notistack';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Button from '@mui/material/Button';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import {Uploads} from '../../api/uploads';
import {normalized} from '../../api/string';

import CancelButton from '../button/CancelButton';

import ConfirmationTextField, {
	useConfirmationTextFieldState,
} from '../input/ConfirmationTextField';

import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';
import useUniqueId from '../hooks/useUniqueId';
import debounceSnackbar from '../../util/debounceSnackbar';
import AttachmentThumbnail from './AttachmentThumbnail';

const Thumbnail = styled(AttachmentThumbnail)({
	height: 300,
});

interface Props {
	open: boolean;
	onClose: () => void;
	attachment: {_id: string; name: string};
}

const AttachmentSuperDeletionDialog = ({open, onClose, attachment}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const getError = (expected: string, value: string) =>
		normalized(expected) === normalized(value)
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
			Uploads.remove({_id: attachment._id}, (err) => {
				if (err) {
					const message = `[Trash] Error during removal: ${err.message}`;
					console.error(message, {err});
					feedback(message, {variant: 'error'});
				} else {
					const message = '[Trash] File removed from DB and FS';
					console.log(message);
					feedback(message, {variant: 'success'});
					if (isMounted()) onClose();
				}
			});
		}
	};

	const titleId = useUniqueId('attachment-super-deletion-dialog-title');

	return (
		<Dialog open={open} aria-labelledby={titleId} onClose={onClose}>
			<DialogTitle id={titleId}>
				Delete attachment {attachment.name}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to delete this attachment, click cancel. If you
					really want to delete this attachment from the system, enter its
					filename below and click the delete button.
				</DialogContentText>
				<Thumbnail height={600} attachmentId={attachment._id} />
				<ConfirmationTextField
					fullWidth
					autoFocus
					margin="dense"
					label="Attachment's filename"
					{...ConfirmationTextFieldProps}
				/>
			</DialogContent>
			<DialogActions>
				<CancelButton onClick={onClose} />
				<Button
					color="secondary"
					disabled={ConfirmationTextFieldProps.error}
					endIcon={<DeleteForeverIcon />}
					onClick={trashThisAttachmentIfAttachmentNameMatches}
				>
					Delete forever
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default withLazyOpening(AttachmentSuperDeletionDialog);
