import React from 'react';

import {styled} from '@mui/material/styles';
import {useSnackbar} from 'notistack';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import LinkOffIcon from '@mui/icons-material/LinkOff';

import LoadingButton from '@mui/lab/LoadingButton';

import {normalizedLine} from '../../api/string';

import type Endpoint from '../../api/endpoint/Endpoint';

import ConfirmationTextField, {
	useConfirmationTextFieldState,
} from '../input/ConfirmationTextField';

import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';
import CancelButton from '../button/CancelButton';
import debounceSnackbar from '../snackbar/debounceSnackbar';
import useCall from '../action/useCall';

import AttachmentThumbnail from './AttachmentThumbnail';

const Thumbnail = styled(AttachmentThumbnail)({
	height: 300,
});

type Props = {
	readonly open: boolean;
	readonly onClose: () => void;
	readonly itemId: string;
	readonly attachment: {_id: string; name: string};
	readonly endpoint: Endpoint<[string, string], any>;
};

const AttachmentDeletionDialog = ({
	open,
	onClose,
	itemId,
	attachment,
	endpoint,
}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [call, {pending}] = useCall();

	const getError = (expected: string, value: string) =>
		normalizedLine(expected) === normalizedLine(value)
			? ''
			: 'Attachment names do not match';

	const {validate, props: ConfirmationTextFieldProps} =
		useConfirmationTextFieldState(attachment.name, getError);

	const isMounted = useIsMounted();

	const detachThisAttachmentIfAttachmentNameMatches = async (event) => {
		event.preventDefault();
		if (validate()) {
			const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
			feedback('Processing...', {variant: 'info', persist: true});
			try {
				await call(endpoint, itemId, attachment._id);
				const message = `[Detach] Attachment ${attachment.name} detached with ${endpoint.name}(${itemId}).`;
				console.log(message);
				feedback(message, {variant: 'success'});
				if (isMounted()) onClose();
			} catch (error: unknown) {
				const message =
					error instanceof Error ? error.message : 'unknown error';
				feedback(message, {variant: 'error'});
				console.error({error});
			}
		}
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Detach attachment {attachment.name}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to detach this attachment, click cancel. If you
					really want to detach this attachment from the system, enter its
					filename below and click the detach button.
				</DialogContentText>
				<Thumbnail width={550} height={300} attachmentId={attachment._id} />
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
				<LoadingButton
					color="secondary"
					disabled={ConfirmationTextFieldProps.error}
					loading={pending}
					endIcon={<LinkOffIcon />}
					loadingPosition="end"
					onClick={detachThisAttachmentIfAttachmentNameMatches}
				>
					Detach
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
};

export default withLazyOpening(AttachmentDeletionDialog);
