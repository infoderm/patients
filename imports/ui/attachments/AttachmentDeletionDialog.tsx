import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import {useSnackbar} from 'notistack';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';

import LinkOffIcon from '@material-ui/icons/LinkOff';
import CancelIcon from '@material-ui/icons/Cancel';

import {normalized} from '../../api/string';

import call from '../../api/endpoint/call';
import Endpoint from '../../api/endpoint/Endpoint';

import ConfirmationTextField, {
	useConfirmationTextFieldState,
} from '../input/ConfirmationTextField';

import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';
import AttachmentThumbnail from './AttachmentThumbnail';

const useStyles = makeStyles({
	thumbnail: {
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
	const classes = useStyles();
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

	return (
		<Dialog
			open={open}
			// component="form"
			aria-labelledby="attachment-deletion-dialog-title"
			onClose={onClose}
		>
			<DialogTitle id="attachment-deletion-dialog-title">
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
				<Button
					type="submit"
					color="default"
					endIcon={<CancelIcon />}
					onClick={onClose}
				>
					Cancel
				</Button>
				<Button
					color="secondary"
					disabled={ConfirmationTextFieldProps.error}
					endIcon={<LinkOffIcon />}
					onClick={detachThisAttachmentIfAttachmentNameMatches}
				>
					Detach
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default withLazyOpening(AttachmentDeletionDialog);
