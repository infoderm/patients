import React from 'react';

import {useSnackbar} from 'notistack';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';

import RestoreIcon from '@mui/icons-material/Restore';

import LoadingButton from '@mui/lab/LoadingButton';

import {normalizedLine} from '../../api/string';
import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';

import usePatient from '../patients/usePatient';

import ConfirmationTextField, {
	useConfirmationTextFieldState,
} from '../input/ConfirmationTextField';

import restoreAppointment from '../../api/endpoint/consultations/restoreAppointment';
import {type ConsultationDocument} from '../../api/collection/consultations';
import CancelButton from '../button/CancelButton';
import debounceSnackbar from '../snackbar/debounceSnackbar';
import useCall from '../action/useCall';

type Props = {
	open: boolean;
	onClose: () => void;
	consultation: ConsultationDocument;
};

const ConsultationAppointmentRestorationDialog = ({
	open,
	onClose,
	consultation,
}: Props) => {
	const deps = [
		consultation.patientId,
		JSON.stringify(ConsultationAppointmentRestorationDialog.projection),
	];
	const {
		loading,
		found,
		fields: patient,
	} = usePatient(
		{},
		{
			filter: {_id: consultation.patientId},
			projection: ConsultationAppointmentRestorationDialog.projection,
		},
		deps,
	);

	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [call, {pending}] = useCall();
	const getError = (expected, value) =>
		normalizedLine(expected) === normalizedLine(value)
			? ''
			: 'Last names do not match';

	const {validate, props: ConfirmationTextFieldProps} =
		useConfirmationTextFieldState(patient.lastname ?? '', getError);

	const isMounted = useIsMounted();

	const restoreThisConsultationsAppointmentIfPatientsLastNameMatches = async (
		event,
	) => {
		event.preventDefault();
		if (validate()) {
			const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
			feedback('Processing...', {variant: 'info', persist: true});
			try {
				await call(restoreAppointment, consultation._id);
				const message = `Appointment #${consultation._id} restored from consultation.`;
				console.log(message);
				feedback(message, {variant: 'success'});
				if (isMounted()) onClose();
			} catch (error: unknown) {
				console.error({error});
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
					disabled={!found || pending}
					margin="dense"
					label={label}
					{...ConfirmationTextFieldProps}
				/>
			</DialogContent>
			<DialogActions>
				<CancelButton disabled={pending} onClick={onClose} />
				<LoadingButton
					disabled={!found || ConfirmationTextFieldProps.error}
					loading={pending}
					color="secondary"
					endIcon={<RestoreIcon />}
					loadingPosition="end"
					onClick={restoreThisConsultationsAppointmentIfPatientsLastNameMatches}
				>
					Restore
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
};

ConsultationAppointmentRestorationDialog.projection = {
	firstname: 1,
	lastname: 1,
} as const;

export default withLazyOpening(ConsultationAppointmentRestorationDialog);
