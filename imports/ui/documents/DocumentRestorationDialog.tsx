import React from 'react';

import {useSnackbar} from 'notistack';

import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import CancelIcon from '@mui/icons-material/Cancel';

import ConfirmationDialog from '../modal/ConfirmationDialog';
import withLazyOpening from '../modal/withLazyOpening';
import restore from '../../api/endpoint/documents/restore';
import debounceSnackbar from '../../util/debounceSnackbar';
import useCall from '../action/useCall';

type Props = {
	open: boolean;
	onClose: () => void;
	document: any;
};

const DocumentRestorationDialog = ({open, onClose, document}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [call, {pending}] = useCall();

	const restoreThisDocument = async (event) => {
		event.preventDefault();
		const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
		feedback('Processing...', {variant: 'info', persist: true});
		try {
			await call(restore, document._id);
			const message = `Document #${document._id} restored.`;
			console.log(message);
			feedback(message, {variant: 'success'});
			onClose();
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
			title={`Restore document ${document._id.toString()}`}
			text="If you do not want to restore this document, click cancel. If you really want to restore this document from the system, click the restore button."
			cancel="Cancel"
			CancelIcon={CancelIcon}
			confirm="Restore"
			ConfirmIcon={RestoreFromTrashIcon}
			confirmColor="primary"
			onCancel={onClose}
			onConfirm={restoreThisDocument}
		/>
	);
};

export default withLazyOpening(DocumentRestorationDialog);
