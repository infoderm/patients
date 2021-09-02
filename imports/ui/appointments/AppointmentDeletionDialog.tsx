import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

import call from '../../api/endpoint/call';
import appointmentsRemove from '../../api/endpoint/appointments/remove';

import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';

const AppointmentDeletionDialog = (props) => {
	const {open, onClose, appointment} = props;

	const isMounted = useIsMounted();

	const deleteThisAppointment = async (event) => {
		event.preventDefault();
		try {
			await call(appointmentsRemove, appointment._id);
			console.log(`Appointment #${appointment._id} deleted.`);
			if (isMounted()) onClose();
		} catch (error: unknown) {
			console.error(error);
		}
	};

	return (
		<Dialog
			open={open}
			// component="form"
			aria-labelledby="appointment-deletion-dialog-title"
			onClose={onClose}
		>
			<DialogTitle id="appointment-deletion-dialog-title">
				Delete this appointment
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to delete this appointment, click cancel. If you
					really want to delete this appointment from the system, click delete.
				</DialogContentText>
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
					color="secondary"
					endIcon={<DeleteIcon />}
					onClick={deleteThisAppointment}
				>
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
};

AppointmentDeletionDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	appointment: PropTypes.object.isRequired,
};

export default withLazyOpening(AppointmentDeletionDialog);
