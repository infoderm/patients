import React, {useState} from 'react';

import {useNavigate} from 'react-router-dom';

import {useSnackbar} from 'notistack';

import MergeTypeIcon from '@mui/icons-material/MergeType';
import CancelIcon from '@mui/icons-material/Cancel';

import patientsMerge from '../../api/endpoint/patients/merge';

import ConfirmationDialog from '../modal/ConfirmationDialog';
import withLazyOpening from '../modal/withLazyOpening';
import debounceSnackbar from '../snackbar/debounceSnackbar';
import useCall from '../action/useCall';
import {type PatientFields} from '../../api/collection/patients';

type Props = {
	readonly open: boolean;
	readonly onClose: () => void;
	readonly toCreate: PatientFields;
	readonly consultationsToAttach: string[];
	readonly attachmentsToAttach: string[];
	readonly documentsToAttach: string[];
	readonly toDelete: string[];
};

const MergePatientsConfirmationDialog = ({
	open,
	onClose,
	toCreate,
	consultationsToAttach,
	attachmentsToAttach,
	documentsToAttach,
	toDelete,
}: Props) => {
	const navigate = useNavigate();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [call, {pending}] = useCall();
	const [merged, setMerged] = useState(false);

	const mergePatients = async (event) => {
		event.preventDefault();
		const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
		feedback('Processing...', {variant: 'info', persist: true});
		try {
			const _id = await call(
				patientsMerge,
				toDelete,
				consultationsToAttach,
				attachmentsToAttach,
				documentsToAttach,
				toCreate,
			);
			setMerged(true);
			const message = `Merged. Patient #${_id} created.`;
			console.log(message);
			feedback(message, {variant: 'success'});
			navigate({pathname: `/patient/${_id}`});
		} catch (error: unknown) {
			console.error({error});
			const message = error instanceof Error ? error.message : 'unknown error';
			feedback(message, {variant: 'error'});
		}
	};

	return (
		<ConfirmationDialog
			open={open}
			pending={pending || merged}
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
