import React from 'react';

import {useSnackbar} from 'notistack';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import call from '../../api/endpoint/call';
import patientsRemove from '../../api/endpoint/patients/remove';

import {normalized} from '../../api/string';
import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';
import useUniqueId from '../hooks/useUniqueId';

import DeleteButton from '../button/DeleteButton';
import CancelButton from '../button/CancelButton';

import ConfirmationTextField, {
	useConfirmationTextFieldState,
} from '../input/ConfirmationTextField';
import StaticPatientCard from './StaticPatientCard';

interface Props {
	open: boolean;
	onClose: () => void;
	patient: {
		_id: string;
		lastname: string;
		firstname: string;
	};
}

const PatientDeletionDialog = ({open, onClose, patient}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const getError = (expected, value) =>
		normalized(expected) === normalized(value) ? '' : 'Last names do not match';

	const {validate, props: ConfirmationTextFieldProps} =
		useConfirmationTextFieldState(patient.lastname || '', getError);

	const isMounted = useIsMounted();

	const deleteThisPatientIfLastNameMatches = async (event) => {
		event.preventDefault();
		if (validate()) {
			const key = enqueueSnackbar('Processing...', {
				variant: 'info',
				persist: true,
			});
			try {
				await call(patientsRemove, patient._id);
				closeSnackbar(key);
				const message = `Patient #${patient._id} deleted.`;
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

	const titleId = useUniqueId('patient-deletion-dialog-title');

	return (
		<Dialog open={open} aria-labelledby={titleId} onClose={onClose}>
			<DialogTitle id={titleId}>
				Delete patient {patient.firstname} {patient.lastname}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to delete this patient, click cancel. If you really
					want to delete this patient from the system, enter its last name below
					and click the delete button.
				</DialogContentText>
				<StaticPatientCard patient={patient} />
				<ConfirmationTextField
					autoFocus
					fullWidth
					margin="dense"
					label="Patient's last name"
					{...ConfirmationTextFieldProps}
				/>
			</DialogContent>
			<DialogActions>
				<CancelButton onClick={onClose} />
				<DeleteButton
					disabled={ConfirmationTextFieldProps.error}
					onClick={deleteThisPatientIfLastNameMatches}
				/>
			</DialogActions>
		</Dialog>
	);
};

export default withLazyOpening(PatientDeletionDialog);
