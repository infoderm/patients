import React from 'react';

import {useSnackbar} from 'notistack';

import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';

import call from '../../api/endpoint/call';
import deleteDocument from '../../api/endpoint/documents/delete';

import ConfirmationDialog from '../modal/ConfirmationDialog';
import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';

interface Props {
	open: boolean;
	onClose: () => void;
	document: any;
}

const DocumentDeletionDialog = ({open, onClose, document}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const isMounted = useIsMounted();

	const deleteThisDocument = async (event) => {
		event.preventDefault();
		const key = enqueueSnackbar('Processing...', {variant: 'info'});
		try {
			await call(deleteDocument, document._id);
			closeSnackbar(key);
			const message = `Document #${document._id} deleted.`;
			console.log(message);
			enqueueSnackbar(message, {variant: 'success'});
			if (isMounted()) onClose();
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
			title={`Delete document ${document._id.toString()}`}
			text="If you do not want to delete this document, click cancel. If you really want to delete this document from the system, click the delete button."
			cancel="Cancel"
			CancelIcon={CancelIcon}
			confirm="Delete"
			ConfirmIcon={DeleteIcon}
			confirmColor="secondary"
			onCancel={onClose}
			onConfirm={deleteThisDocument}
		/>
	);
};

export default withLazyOpening(DocumentDeletionDialog);
