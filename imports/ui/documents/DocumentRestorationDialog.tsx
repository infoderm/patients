import React from 'react';

import {useSnackbar} from 'notistack';

import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import CancelIcon from '@material-ui/icons/Cancel';

import call from '../../api/endpoint/call';

import ConfirmationDialog from '../modal/ConfirmationDialog';
import withLazyOpening from '../modal/withLazyOpening';
import restore from '../../api/endpoint/documents/restore';

interface Props {
	open: boolean;
	onClose: () => void;
	document: any;
}

const DocumentRestorationDialog = ({open, onClose, document}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const restoreThisDocument = async (event) => {
		event.preventDefault();
		const key = enqueueSnackbar('Processing...', {variant: 'info'});
		try {
			await call(restore, document._id);
			closeSnackbar(key);
			const message = `Document #${document._id} restored.`;
			console.log(message);
			enqueueSnackbar(message, {variant: 'success'});
			onClose();
		} catch (error: unknown) {
			closeSnackbar(key);
			console.error(error);
			const message = error instanceof Error ? error.message : 'unknown error';
			enqueueSnackbar(message, {variant: 'error'});
		}
	};

	return (
		<ConfirmationDialog
			open={open}
			title={`Restore document ${document._id.toString()}`}
			text="If you do not want to restore this document, click cancel. If you really want to restore this document from the system, click the restore button."
			cancel="Cancel"
			CancelIcon={CancelIcon}
			cancelColor="default"
			confirm="Restore"
			ConfirmIcon={RestoreFromTrashIcon}
			confirmColor="primary"
			onCancel={onClose}
			onConfirm={restoreThisDocument}
		/>
	);
};

export default withLazyOpening(DocumentRestorationDialog);
