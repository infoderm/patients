import React from 'react';

import {useSnackbar} from 'notistack';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import patientsRemove from '../../api/endpoint/patients/remove';

import {normalized} from '../../api/string';
import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';

import DeleteButton from '../button/DeleteButton';
import CancelButton from '../button/CancelButton';

import ConfirmationTextField, {
	useConfirmationTextFieldState,
} from '../input/ConfirmationTextField';
import debounceSnackbar from '../../util/debounceSnackbar';
import useCall from '../action/useCall';
import StaticPatientCard from './StaticPatientCard';
import CardPatientProjection from './CardPatientProjection';

interface Props {
	open: boolean;
	onClose: () => void;
	patient: CardPatientProjection<typeof StaticPatientCard>;
}

const PatientDeletionDialog = ({open, onClose, patient}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [call, {pending}] = useCall();
	const getError = (expected, value) =>
		normalized(expected) === normalized(value) ? '' : 'Last names do not match';

	const {validate, props: ConfirmationTextFieldProps} =
		useConfirmationTextFieldState(patient.lastname || '', getError);

	const isMounted = useIsMounted();

	const deleteThisPatientIfLastNameMatches = async (event) => {
		event.preventDefault();
		if (validate()) {
			const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
			feedback('Processing...', {
				variant: 'info',
				persist: true,
			});
			try {
				await call(patientsRemove, patient._id);
				const message = `Patient #${patient._id} deleted.`;
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

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>
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
					disabled={pending}
					margin="dense"
					label="Patient's last name"
					{...ConfirmationTextFieldProps}
				/>
			</DialogContent>
			<DialogActions>
				<CancelButton disabled={pending} onClick={onClose} />
				<DeleteButton
					loading={pending}
					disabled={ConfirmationTextFieldProps.error}
					onClick={deleteThisPatientIfLastNameMatches}
				/>
			</DialogActions>
		</Dialog>
	);
};

export default withLazyOpening(PatientDeletionDialog);
