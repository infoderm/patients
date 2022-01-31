import React, {useState} from 'react';

import {useHistory} from 'react-router-dom';

import {useSnackbar} from 'notistack';

import MergeTypeIcon from '@material-ui/icons/MergeType';
import CancelIcon from '@material-ui/icons/Cancel';

import call from '../../api/endpoint/call';
import patientsMerge from '../../api/endpoint/patients/merge';

import ConfirmationDialog from '../modal/ConfirmationDialog';
import withLazyOpening from '../modal/withLazyOpening';

interface Props {
	open: boolean;
	onClose: () => void;
	toCreate: {};
	consultationsToAttach: unknown[];
	attachmentsToAttach: unknown[];
	documentsToAttach: unknown[];
	toDelete: unknown[];
}

const MergePatientsConfirmationDialog = ({
	open,
	onClose,
	toCreate,
	consultationsToAttach,
	attachmentsToAttach,
	documentsToAttach,
	toDelete,
}: Props) => {
	const history = useHistory();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [pending, setPending] = useState(false);

	const mergePatients = async (event) => {
		event.preventDefault();
		setPending(true);
		const key = enqueueSnackbar('Processing...', {variant: 'info'});
		try {
			const _id = await call(
				patientsMerge,
				toDelete,
				consultationsToAttach,
				attachmentsToAttach,
				documentsToAttach,
				toCreate,
			);
			closeSnackbar(key);
			const message = `Merged. Patient #${_id} created.`;
			console.log(message);
			enqueueSnackbar(message, {variant: 'success'});
			history.push({pathname: `/patient/${_id}`});
		} catch (error: unknown) {
			setPending(false);
			closeSnackbar(key);
			console.error({error});
			const message = error instanceof Error ? error.message : 'unknown error';
			enqueueSnackbar(message, {variant: 'error'});
		}
	};

	return (
		<ConfirmationDialog
			open={open}
			pending={pending}
			title={`Merge ${toDelete.length} patients`}
			text={
				<>
					<b>1 new patient</b> will be created,{' '}
					<b>{consultationsToAttach.length} consultations</b>,{' '}
					<b>{documentsToAttach.length} documents</b>, and{' '}
					<b>{attachmentsToAttach.length} attachments</b> will be attached to
					it, <b>{toDelete.length} patients will be deleted</b>. If you do not
					want to merge those patients, click cancel. If you really want to
					merge those patients, click the merge button.
				</>
			}
			cancel="Cancel"
			cancelColor="default"
			CancelIcon={CancelIcon}
			confirm="Merge"
			confirmColor="secondary"
			ConfirmIcon={MergeTypeIcon}
			onCancel={onClose}
			onConfirm={mergePatients}
		/>
	);
};

export default withLazyOpening(MergePatientsConfirmationDialog);
