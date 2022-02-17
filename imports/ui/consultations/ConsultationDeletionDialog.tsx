import React from 'react';

import {useSnackbar} from 'notistack';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';

import {ConsultationDocument} from '../../api/collection/consultations';

import {normalized} from '../../api/string';
import usePatient from '../patients/usePatient';
import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';

import ConfirmationTextField, {
	useConfirmationTextFieldState,
} from '../input/ConfirmationTextField';
import remove from '../../api/endpoint/consultations/remove';
import CancelButton from '../button/CancelButton';
import DeleteButton from '../button/DeleteButton';
import debounceSnackbar from '../../util/debounceSnackbar';
import useCall from '../action/useCall';

interface Props {
	open: boolean;
	onClose: () => void;
	consultation: ConsultationDocument;
}

const ConsultationDeletionDialog = ({open, onClose, consultation}: Props) => {
	const options = {fields: ConsultationDeletionDialog.projection};
	const deps = [
		consultation.patientId,
		JSON.stringify(ConsultationDeletionDialog.projection),
	];
	const {
		loading,
		found,
		fields: patient,
	} = usePatient({}, consultation.patientId, options, deps);

	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [call, {pending}] = useCall();
	const getError = (expected, value) =>
		normalized(expected) === normalized(value) ? '' : 'Last names do not match';

	const {validate, props: ConfirmationTextFieldProps} =
		useConfirmationTextFieldState(patient.lastname, getError);

	const isMounted = useIsMounted();

	const deleteThisConsultationIfPatientsLastNameMatches = async (event) => {
		event.preventDefault();
		if (validate()) {
			const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
			feedback('Processing...', {variant: 'info', persist: true});
			try {
				await call(remove, consultation._id);
				const message = `Consultation #${consultation._id} deleted.`;
				console.log(message);
				feedback(message, {variant: 'success'});
				if (isMounted()) onClose();
			} catch (error: unknown) {
				console.error(error);
				const message =
					error instanceof Error ? error.message : 'unknown error';
				feedback(message, {variant: 'error'});
			}
		}
	};

	const patientIdentifier = found
		? `${patient.firstname} ${patient.lastname}`
		: `#${consultation.patientId}`;
	const label = loading
		? 'Loading patient data...'
		: found
		? "Patient's last name"
		: 'Could not find patient.';

	return (
		<Dialog open={open} onClose={onClose}>
			{loading && <LinearProgress />}
			<DialogTitle>
				Delete consultation for patient {patientIdentifier}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to delete this consultation, click cancel. If you
					really want to delete this consultation from the system, enter the
					patient&apos;s last name below and click the delete button.
				</DialogContentText>
				<ConfirmationTextField
					autoFocus
					fullWidth
					disabled={!found || pending}
					margin="dense"
					label={label}
					{...ConfirmationTextFieldProps}
				/>
			</DialogContent>
			<DialogActions>
				<CancelButton disabled={pending} onClick={onClose} />
				<DeleteButton
					loading={pending}
					disabled={!found || ConfirmationTextFieldProps.error}
					onClick={deleteThisConsultationIfPatientsLastNameMatches}
				/>
			</DialogActions>
		</Dialog>
	);
};

ConsultationDeletionDialog.projection = {
	firstname: 1,
	lastname: 1,
};

export default withLazyOpening(ConsultationDeletionDialog);
