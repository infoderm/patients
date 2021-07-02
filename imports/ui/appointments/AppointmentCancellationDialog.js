import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';

import call from '../../api/call';

import {useSetting} from '../../client/settings';
import withLazyOpening from '../modal/withLazyOpening';

const AppointmentCancellationDialog = (props) => {
	const {open, onClose, appointment} = props;

	const {loading, value: reasons} = useSetting(
		'appointment-cancellation-reason'
	);
	const [reason, setReason] = useState(loading ? '' : reasons[0] || '');
	const [explanation, setExplanation] = useState('');

	const cancelThisAppointment = async (event) => {
		event.preventDefault();
		try {
			await call('appointments.cancel', appointment._id, reason, explanation);
			console.log(`Appointment #${appointment._id} cancelled.`);
			onClose();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Dialog
			open={open}
			// component="form"
			aria-labelledby="appointment-cancellation-dialog-title"
			onClose={onClose}
		>
			<DialogTitle id="appointment-cancellation-dialog-title">
				Cancel this appointment
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to cancel this appointment, click cancel. If you
					really want to cancel this appointment from the system, click cancel.
				</DialogContentText>
				<FormControl fullWidth margin="normal">
					<InputLabel htmlFor="cancellation-reason">
						Cancellation Reason
					</InputLabel>
					<Select
						readOnly={loading}
						value={reason}
						inputProps={{
							name: 'cancellation-reason',
							id: 'cancellation-reason'
						}}
						onChange={(e) => setReason(e.target.value)}
					>
						{reasons.map((x) => (
							<MenuItem key={x} value={x}>
								{x}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<TextField
					fullWidth
					margin="normal"
					label="Explanation for cancellation"
					placeholder="Please give an explanation for the cancellation (optional)"
					value={explanation}
					error={!explanation}
					InputLabelProps={{
						shrink: true
					}}
					onChange={(e) => setExplanation(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button
					type="submit"
					color="default"
					endIcon={<AlarmOnIcon />}
					onClick={onClose}
				>
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

AppointmentCancellationDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	appointment: PropTypes.object.isRequired
};

export default withLazyOpening(AppointmentCancellationDialog);
