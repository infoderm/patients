import React from 'react';

import {styled} from '@mui/material/styles';
import {useSnackbar} from 'notistack';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Button from '@mui/material/Button';

import LinkOffIcon from '@mui/icons-material/LinkOff';

import {normalized} from '../../api/string';

import call from '../../api/endpoint/call';
import Endpoint from '../../api/endpoint/Endpoint';

import ConfirmationTextField, {
	useConfirmationTextFieldState,
} from '../input/ConfirmationTextField';

import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';
import CancelButton from '../button/CancelButton';
import useUniqueId from '../hooks/useUniqueId';
import AttachmentThumbnail from './AttachmentThumbnail';

const PREFIX = 'AttachmentDeletionDialog';

const classes = {
	thumbnail: `${PREFIX}-thumbnail`,
};

const StyledDialog = styled(Dialog)({
	[`& .${classes.thumbnail}`]: {
		height: 300,
	},
});

interface Props {
	open: boolean;
	onClose: () => void;
	itemId: string;
	attachment: {_id: string; name: string};
	endpoint: Endpoint<unknown>;
}

const AttachmentDeletionDialog = ({
	open,
	onClose,
	itemId,
	attachment,
	endpoint,
}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const getError = (expected: string, value: string) =>
		normalized(expected) === normalized(value)
			? ''
			: 'Attachment names do not match';

	const {validate, props: ConfirmationTextFieldProps} =
		useConfirmationTextFieldState(attachment.name, getError);

	const isMounted = useIsMounted();

	const detachThisAttachmentIfAttachmentNameMatches = async (event) => {
		event.preventDefault();
		if (validate()) {
			const key = enqueueSnackbar('Processing...', {variant: 'info'});
			try {
				await call(endpoint, itemId, attachment._id);
				closeSnackbar(key);
				const message = `[Detach] Attachment ${attachment.name} detached with ${endpoint.name}(${itemId}).`;
				console.log(message);
				enqueueSnackbar(message, {variant: 'success'});
				if (isMounted()) onClose();
			} catch (error: unknown) {
				closeSnackbar(key);
				const message =
					error instanceof Error ? error.message : 'unknown error';
				enqueueSnackbar(message, {variant: 'error'});
				console.error({error});
			}
		}
	};

	const titleId = useUniqueId('attachment-deletion-dialog-title');

	return (
		<StyledDialog open={open} aria-labelledby={titleId} onClose={onClose}>
			<DialogTitle id={titleId}>
				Detach attachment {attachment.name}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to detach this attachment, click cancel. If you
					really want to detach this attachment from the system, enter its
					filename below and click the detach button.
				</DialogContentText>
				<AttachmentThumbnail
					className={classes.thumbnail}
					height={600}
					attachmentId={attachment._id}
				/>
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
					endIcon={<LinkOffIcon />}
					onClick={detachThisAttachmentIfAttachmentNameMatches}
				>
					Detach
				</Button>
			</DialogActions>
		</StyledDialog>
	);
};

export default withLazyOpening(AttachmentDeletionDialog);
