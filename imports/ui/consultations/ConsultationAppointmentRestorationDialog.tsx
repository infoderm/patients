import React from 'react';

import {useSnackbar} from 'notistack';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';

import RestoreIcon from '@mui/icons-material/Restore';

import {normalized} from '../../api/string';
import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';

import usePatient from '../patients/usePatient';

import ConfirmationTextField, {
	useConfirmationTextFieldState,
} from '../input/ConfirmationTextField';

import call from '../../api/endpoint/call';
import restoreAppointment from '../../api/endpoint/consultations/restoreAppointment';
import {ConsultationDocument} from '../../api/collection/consultations';
import useUniqueId from '../hooks/useUniqueId';
import CancelButton from '../button/CancelButton';

interface Props {
	open: boolean;
	onClose: () => void;
	consultation: ConsultationDocument;
}

const ConsultationAppointmentRestorationDialog = ({
	open,
	onClose,
	consultation,
}: Props) => {
	const options = {fields: ConsultationAppointmentRestorationDialog.projection};
	const deps = [
		consultation.patientId,
		JSON.stringify(ConsultationAppointmentRestorationDialog.projection),
	];
	const {
		loading,
		found,
		fields: patient,
	} = usePatient({}, consultation.patientId, options, deps);

	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const getError = (expected, value) =>
		normalized(expected) === normalized(value) ? '' : 'Last names do not match';

	const {validate, props: ConfirmationTextFieldProps} =
		useConfirmationTextFieldState(patient.lastname, getError);

	const isMounted = useIsMounted();

	const restoreThisConsultationsAppointmentIfPatientsLastNameMatches = async (
		event,
	) => {
		event.preventDefault();
		if (validate()) {
			const key = enqueueSnackbar('Processing...', {variant: 'info'});
			try {
				await call(restoreAppointment, consultation._id);
				closeSnackbar(key);
				const message = `Appointment #${consultation._id} restored from consultation.`;
				console.log(message);
				enqueueSnackbar(message, {variant: 'success'});
				if (isMounted()) onClose();
			} catch (error: unknown) {
				closeSnackbar(key);
				console.error({error});
				const message =
					error instanceof Error ? error.message : 'unknown error';
				enqueueSnackbar(message, {variant: 'error'});
			}
		}
	};

	const titleId = useUniqueId(
		'consultation-appointment-restoration-dialog-title',
	);

	const patientIdentifier = found
		? `${patient.firstname} ${patient.lastname}`
		: `#${consultation.patientId}`;
	const label = loading
		? 'Loading patient data...'
		: found
		? "Patient's last name"
		: 'Could not find patient.';
	return (
		<Dialog open={open} aria-labelledby={titleId} onClose={onClose}>
			{loading && <LinearProgress />}
			<DialogTitle id={titleId}>
				Restore consultation&apos;s appointment for patient {patientIdentifier}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to do this, click cancel. If you really want to do
					this, enter the patient&apos;s last name below and click the restore
					button.
				</DialogContentText>
				<ConfirmationTextField
					autoFocus
					fullWidth
					disabled={!found}
					margin="dense"
					label={label}
					{...ConfirmationTextFieldProps}
				/>
			</DialogContent>
			<DialogActions>
				<CancelButton onClick={onClose} />
				<Button
					disabled={!found || ConfirmationTextFieldProps.error}
					color="secondary"
					endIcon={<RestoreIcon />}
					onClick={restoreThisConsultationsAppointmentIfPatientsLastNameMatches}
				>
					Restore
				</Button>
			</DialogActions>
		</Dialog>
	);
};

ConsultationAppointmentRestorationDialog.projection = {
	firstname: 1,
	lastname: 1,
};

export default withLazyOpening(ConsultationAppointmentRestorationDialog);
