import React, {useState} from 'react';

import makeStyles from '@mui/styles/makeStyles';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import LinearProgress from '@mui/material/LinearProgress';

import LocalShippingIcon from '@mui/icons-material/LocalShipping';

import call from '../../api/endpoint/call';

import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';
import PatientPicker from '../patients/PatientPicker';

import {capitalized, normalized} from '../../api/string';
import virtualFields from '../../api/consultations/virtualFields';

import usePatient from '../patients/usePatient';

import ConfirmationTextField, {
	useConfirmationTextFieldState,
} from '../input/ConfirmationTextField';

import makePatientsSuggestions from '../patients/makePatientsSuggestions';
import ReactivePatientChip from '../patients/ReactivePatientChip';
import transfer from '../../api/endpoint/consultations/transfer';
import CancelButton from '../button/CancelButton';
import StaticConsultationCardChips from './StaticConsultationCardChips';

const useStyles = makeStyles({
	dialogPaper: {
		overflow: 'visible',
	},
});

interface Props {
	open: boolean;
	onClose: () => void;
	consultation: any;
}

const ConsultationTransferDialog = ({open, onClose, consultation}: Props) => {
	const classes = useStyles();

	const {patientId, isDone} = consultation;

	const itemKind = isDone ? 'consultation' : 'appointment';
	const itemKindCapitalized = capitalized(itemKind);

	const {
		loading: loadingPatient,
		found: foundPatient,
		fields: currentPatient,
	} = usePatient(
		{_id: patientId},
		patientId,
		{
			fields: {
				lastname: 1,
			},
		},
		[patientId],
	);

	const [patients, setPatients] = useState([]);

	const getError = (expected, value) =>
		normalized(expected) === normalized(value) ? '' : 'Last names do not match';

	const {validate, props: ConfirmationTextFieldProps} =
		useConfirmationTextFieldState(currentPatient.lastname || '', getError);

	const isMounted = useIsMounted();

	const transferThisConsultation = async (event) => {
		event.preventDefault();
		if (validate()) {
			const consultationId = consultation._id;
			const patientId = patients[0]._id;
			try {
				await call(transfer, consultationId, patientId);
				console.log(
					`${itemKindCapitalized} #${consultationId} transferred to patient #${patientId}.`,
				);
				if (isMounted()) onClose();
			} catch (error: unknown) {
				console.error(error);
			}
		}
	};

	return (
		<Dialog
			classes={{paper: classes.dialogPaper}}
			open={open}
			onClose={onClose}
		>
			{loadingPatient && <LinearProgress />}
			<DialogTitle>
				Transfer {itemKind} {consultation._id.toString()}
			</DialogTitle>
			<DialogContent className={classes.dialogPaper}>
				<DialogContentText>
					If you do not want to transfer this {itemKind}, click cancel. If you
					really want to transfer this {itemKind}, confirm the current
					patient&apos;s last name, then enter the name of the patient to
					transfer it to, and finally click the transfer button.
				</DialogContentText>
				<StaticConsultationCardChips
					{...virtualFields(consultation)}
					showDate
					showTime
					showPrice
					consultation={consultation}
					attachments={[]}
					patient={currentPatient}
					loadingPatient={loadingPatient}
					PatientChip={ReactivePatientChip}
				/>
				<ConfirmationTextField
					autoFocus
					fullWidth
					margin="dense"
					label="Patient's last name"
					{...ConfirmationTextFieldProps}
				/>
				<PatientPicker
					TextFieldProps={{
						label: `Patient to transfer ${itemKind} to`,
						margin: 'normal',
					}}
					useSuggestions={makePatientsSuggestions([currentPatient])}
					value={patients}
					onChange={(e) => {
						setPatients(e.target.value);
					}}
				/>
			</DialogContent>
			<DialogActions>
				<CancelButton onClick={onClose} />
				<Button
					disabled={
						patients.length !== 1 ||
						!foundPatient ||
						ConfirmationTextFieldProps.error
					}
					color="secondary"
					endIcon={<LocalShippingIcon />}
					onClick={transferThisConsultation}
				>
					Transfer
				</Button>
			</DialogActions>
		</Dialog>
	);
};

ConsultationTransferDialog.projection = {
	_id: 1,
};

export default withLazyOpening(ConsultationTransferDialog);
