import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';

import withLazyOpening from '../modal/withLazyOpening';
import call from '../../api/endpoint/call';
import uncancel from '../../api/endpoint/appointments/uncancel';

const AppointmentUncancellationDialog = (props) => {
	const {open, onClose, appointment} = props;

	const uncancelThisAppointment = async (event) => {
		event.preventDefault();
		try {
			await call(uncancel, appointment._id);
			console.log(`Appointment #${appointment._id} uncancelled.`);
			onClose();
		} catch (error: unknown) {
			console.error({error});
		}
	};

	return (
		<Dialog
			open={open}
			aria-labelledby="appointment-uncancellation-dialog-title"
			onClose={onClose}
		>
			<DialogTitle id="appointment-uncancellation-dialog-title">
				Cancel this appointment
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to cancel this appointment, click cancel. If you
					really want to cancel this appointment from the system, click cancel.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button color="default" endIcon={<AlarmOffIcon />} onClick={onClose}>
					Do not uncancel
				</Button>
				<Button
					color="primary"
					endIcon={<AlarmOnIcon />}
					onClick={uncancelThisAppointment}
				>
					Uncancel Appointment
				</Button>
			</DialogActions>
		</Dialog>
	);
};

AppointmentUncancellationDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	appointment: PropTypes.object.isRequired,
};

export default withLazyOpening(AppointmentUncancellationDialog);
