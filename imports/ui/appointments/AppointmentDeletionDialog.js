import {Meteor} from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

import withLazyOpening from '../modal/withLazyOpening.js';
import useIsMounted from '../hooks/useIsMounted.js';

const useStyles = makeStyles((theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
}));

const AppointmentDeletionDialog = (props) => {
	const {open, onClose, appointment} = props;

	const classes = useStyles();

	const isMounted = useIsMounted();

	const deleteThisAppointment = (event) => {
		event.preventDefault();
		Meteor.call('appointments.remove', appointment._id, (err, _res) => {
			if (err) {
				console.error(err);
			} else {
				console.log(`Appointment #${appointment._id} deleted.`);
				if (isMounted()) onClose();
			}
		});
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
				<Button type="submit" color="default" onClick={onClose}>
					Cancel
					<CancelIcon className={classes.rightIcon} />
				</Button>
				<Button color="secondary" onClick={deleteThisAppointment}>
					Delete
					<DeleteIcon className={classes.rightIcon} />
				</Button>
			</DialogActions>
		</Dialog>
	);
};

AppointmentDeletionDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	appointment: PropTypes.object.isRequired
};

export default withLazyOpening(AppointmentDeletionDialog);
