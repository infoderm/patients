import React, {useState} from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';

import LoadingButton from '@mui/lab/LoadingButton';
import {useSetting} from '../settings/hooks';
import withLazyOpening from '../modal/withLazyOpening';
import cancel from '../../api/endpoint/appointments/cancel';
import useCall from '../action/useCall';

interface Props {
	open: boolean;
	onClose: () => void;
	appointment: any;
}

const AppointmentCancellationDialog = ({open, onClose, appointment}: Props) => {
	const {loading, value: reasons} = useSetting(
		'appointment-cancellation-reason',
	);
	const [reason, setReason] = useState('');
	const [explanation, setExplanation] = useState('');
	const [call, {pending}] = useCall();

	const cancelThisAppointment = async (event) => {
		event.preventDefault();
		try {
			await call(cancel, appointment._id, reason, explanation);
			console.log(`Appointment #${appointment._id} cancelled.`);
			onClose();
		} catch (error: unknown) {
			console.error({error});
		}
	};

	return (
		<Dialog open={open} onClose={onClose}>
			{loading && <LinearProgress />}
			<DialogTitle>Cancel this appointment</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to cancel this appointment, click cancel. If you
					really want to cancel this appointment from the system, click cancel.
				</DialogContentText>
				<TextField
					select
					fullWidth
					margin="normal"
					label="Cancellation reason"
					InputProps={{
						readOnly: loading,
					}}
					value={reason}
					error={!reason}
					onChange={(e) => {
						setReason(e.target.value);
					}}
				>
					{reasons.map((x) => (
						<MenuItem key={x} value={x}>
							{x}
						</MenuItem>
					))}
				</TextField>
				<TextField
					fullWidth
					margin="normal"
					label="Explanation for cancellation"
					placeholder="Please give an explanation for the cancellation (optional)"
					value={explanation}
					error={!explanation}
					InputLabelProps={{
						shrink: true,
					}}
					onChange={(e) => {
						setExplanation(e.target.value);
					}}
				/>
			</DialogContent>
			<DialogActions>
				<Button endIcon={<AlarmOnIcon />} onClick={onClose}>
					Do not cancel
				</Button>
				<LoadingButton
					color="secondary"
					disabled={!reason}
					loading={pending}
					endIcon={<AlarmOffIcon />}
					loadingPosition="end"
					onClick={cancelThisAppointment}
				>
					Cancel Appointment
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
};

export default withLazyOpening(AppointmentCancellationDialog);
