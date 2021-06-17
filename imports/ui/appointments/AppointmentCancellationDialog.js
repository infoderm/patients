import {Meteor} from 'meteor/meteor';

import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

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

import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';

import {useSetting} from '../../client/settings.js';
import withLazyOpening from '../modal/withLazyOpening.js';

const useStyles = makeStyles((theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
}));

const AppointmentCancellationDialog = (props) => {
	const {open, onClose, appointment} = props;

	const {loading, value: reasons} = useSetting(
		'appointment-cancellation-reason'
	);
	const [reason, setReason] = useState(loading ? '' : reasons[0] || '');

	const classes = useStyles();

	const cancelThisAppointment = (event) => {
		event.preventDefault();
		Meteor.call('appointments.cancel', appointment._id, reason, (err, _res) => {
			if (err) {
				console.error(err);
			} else {
				console.log(`Appointment #${appointment._id} cancelled.`);
				onClose();
			}
		});
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
				<FormControl fullWidth>
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
			</DialogContent>
			<DialogActions>
				<Button type="submit" color="default" onClick={onClose}>
					Do not cancel
					<AlarmOnIcon className={classes.rightIcon} />
				</Button>
				<Button
					color="secondary"
					disabled={!reason}
					onClick={cancelThisAppointment}
				>
					Cancel Appointment
					<AlarmOffIcon className={classes.rightIcon} />
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
