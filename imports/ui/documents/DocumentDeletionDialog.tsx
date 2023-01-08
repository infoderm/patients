import React from 'react';

import {useSnackbar} from 'notistack';

import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';

import deleteDocument from '../../api/endpoint/documents/delete';

import ConfirmationDialog from '../modal/ConfirmationDialog';
import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';
import debounceSnackbar from '../../util/debounceSnackbar';
import useCall from '../action/useCall';

type Props = {
	open: boolean;
	onClose: () => void;
	document: any;
};

const DocumentDeletionDialog = ({open, onClose, document}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [call, {pending}] = useCall();
	const isMounted = useIsMounted();

	const deleteThisDocument = async (event) => {
		event.preventDefault();
		const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
		feedback('Processing...', {variant: 'info', persist: true});
		try {
			await call(deleteDocument, document._id);
			const message = `Document #${document._id} deleted.`;
			console.log(message);
			feedback(message, {variant: 'success'});
			if (isMounted()) onClose();
		} catch (error: unknown) {
			console.error(error);
			const message = error instanceof Error ? error.message : 'unknown error';
			feedback(message, {variant: 'error'});
		}
	};

	return (
		<ConfirmationDialog
			open={open}
			pending={pending}
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
