import React, {useState} from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';

import call from '../../api/endpoint/call';

import {useSetting} from '../settings/hooks';
import withLazyOpening from '../modal/withLazyOpening';
import cancel from '../../api/endpoint/appointments/cancel';
import useUniqueId from '../hooks/useUniqueId';

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

	const dialogId = useUniqueId('dialog-appointment-cancellation');
	const titleId = `${dialogId}-title`;
	const cancellationReasonInputId = `${dialogId}-input-reason`;
	const cancellationExplanationInputId = `${dialogId}-input-explanation`;

	return (
		<Dialog
			id={dialogId}
			open={open}
			aria-labelledby={titleId}
			onClose={onClose}
		>
			<DialogTitle id={titleId}>Cancel this appointment</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to cancel this appointment, click cancel. If you
					really want to cancel this appointment from the system, click cancel.
				</DialogContentText>
				<TextField
					select
					fullWidth
					id={cancellationReasonInputId}
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
					id={cancellationExplanationInputId}
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
				<Button color="default" endIcon={<AlarmOnIcon />} onClick={onClose}>
					Do not cancel
				</Button>
				<Button
					color="secondary"
					disabled={!reason}
					endIcon={<AlarmOffIcon />}
					onClick={cancelThisAppointment}
				>
					Cancel Appointment
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default withLazyOpening(AppointmentCancellationDialog);
