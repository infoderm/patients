import React from 'react';

import {useSnackbar} from 'notistack';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CancelIcon from '@material-ui/icons/Cancel';

import call from '../../api/endpoint/call';

import ConfirmationDialog from '../modal/ConfirmationDialog';
import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';
import superdelete from '../../api/endpoint/documents/superdelete';

interface Props {
	open: boolean;
	onClose: () => void;
	document: any;
}

const DocumentSuperDeletionDialog = ({open, onClose, document}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const isMounted = useIsMounted();

	const deleteThisDocumentForever = async (event) => {
		event.preventDefault();
		const key = enqueueSnackbar('Processing...', {variant: 'info'});
		try {
			await call(superdelete, document._id);
			closeSnackbar(key);
			const message = `Document #${document._id} deleted forever.`;
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
			title={`Delete document ${document._id.toString()} forever`}
			text="If you do not want to delete this document forever, click cancel. If you really want to delete this document from the system forever, click the delete button."
			cancel="Cancel"
			CancelIcon={CancelIcon}
			cancelColor="default"
			confirm="Delete forever"
			ConfirmIcon={DeleteForeverIcon}
			confirmColor="secondary"
			onCancel={onClose}
			onConfirm={deleteThisDocumentForever}
		/>
	);
};

export default withLazyOpening(DocumentSuperDeletionDialog);
