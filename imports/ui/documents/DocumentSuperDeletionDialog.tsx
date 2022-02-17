import React from 'react';

import {useSnackbar} from 'notistack';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CancelIcon from '@mui/icons-material/Cancel';

import ConfirmationDialog from '../modal/ConfirmationDialog';
import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';
import superdelete from '../../api/endpoint/documents/superdelete';
import debounceSnackbar from '../../util/debounceSnackbar';
import useCall from '../action/useCall';

interface Props {
	open: boolean;
	onClose: () => void;
	document: any;
}

const DocumentSuperDeletionDialog = ({open, onClose, document}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [call, {pending}] = useCall();

	const isMounted = useIsMounted();

	const deleteThisDocumentForever = async (event) => {
		event.preventDefault();
		const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
		feedback('Processing...', {variant: 'info', persist: true});
		try {
			await call(superdelete, document._id);
			const message = `Document #${document._id} deleted forever.`;
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
			title={`Delete document ${document._id.toString()} forever`}
			text="If you do not want to delete this document forever, click cancel. If you really want to delete this document from the system forever, click the delete button."
			cancel="Cancel"
			CancelIcon={CancelIcon}
			confirm="Delete forever"
			ConfirmIcon={DeleteForeverIcon}
			confirmColor="secondary"
			onCancel={onClose}
			onConfirm={deleteThisDocumentForever}
		/>
	);
};

export default withLazyOpening(DocumentSuperDeletionDialog);
