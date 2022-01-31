import React from 'react';

import {useSnackbar} from 'notistack';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';

import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

import {ConsultationDocument} from '../../api/collection/consultations';

import {normalized} from '../../api/string';
import usePatient from '../patients/usePatient';
import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';

import ConfirmationTextField, {
	useConfirmationTextFieldState,
} from '../input/ConfirmationTextField';
import call from '../../api/endpoint/call';
import remove from '../../api/endpoint/consultations/remove';

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
	const getError = (expected, value) =>
		normalized(expected) === normalized(value) ? '' : 'Last names do not match';

	const {validate, props: ConfirmationTextFieldProps} =
		useConfirmationTextFieldState(patient.lastname, getError);

	const isMounted = useIsMounted();

	const deleteThisConsultationIfPatientsLastNameMatches = async (event) => {
		event.preventDefault();
		if (validate()) {
			const key = enqueueSnackbar('Processing...', {variant: 'info'});
			try {
				await call(remove, consultation._id);
				closeSnackbar(key);
				const message = `Consultation #${consultation._id} deleted.`;
				console.log(message);
				enqueueSnackbar(message, {variant: 'success'});
				if (isMounted()) onClose();
			} catch (error: unknown) {
				closeSnackbar(key);
				console.error(error);
				const message =
					error instanceof Error ? error.message : 'unknown error';
				enqueueSnackbar(message, {variant: 'error'});
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
		<Dialog
			open={open}
			// component="form"
			aria-labelledby="consultation-deletion-dialog-title"
			onClose={onClose}
		>
			{loading && <LinearProgress />}
			<DialogTitle id="consultation-deletion-dialog-title">
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
					disabled={!found}
					margin="dense"
					label={label}
					{...ConfirmationTextFieldProps}
				/>
			</DialogContent>
			<DialogActions>
				<Button
					type="submit"
					color="default"
					endIcon={<CancelIcon />}
					onClick={onClose}
				>
					Cancel
				</Button>
				<Button
					disabled={!found || ConfirmationTextFieldProps.error}
					color="secondary"
					endIcon={<DeleteIcon />}
					onClick={deleteThisConsultationIfPatientsLastNameMatches}
				>
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
};

ConsultationDeletionDialog.projection = {
	firstname: 1,
	lastname: 1,
};

export default withLazyOpening(ConsultationDeletionDialog);
