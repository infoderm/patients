import {Meteor} from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '../modal/OptimizedDialog.js';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = (theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
});

class AppointmentDeletionDialog extends React.Component {
	deleteThisAppointment = (event) => {
		const {appointment, onClose} = this.props;
		event.preventDefault();
		Meteor.call('consultations.remove', appointment._id, (err, _res) => {
			if (err) {
				console.error(err);
			} else {
				console.log(`Appointment #${appointment._id} deleted.`);
				onClose();
			}
		});
	};

	render() {
		const {open, onClose, classes} = this.props;

		return (
			<Dialog
				open={open}
				component="form"
				aria-labelledby="appointment-deletion-dialog-title"
				onClose={onClose}
			>
				<DialogTitle id="appointment-deletion-dialog-title">
					Delete this appointment
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						If you do not want to delete this appointment, click cancel. If you
						really want to delete this appointment from the system, click
						delete.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button type="submit" color="default" onClick={onClose}>
						Cancel
						<CancelIcon className={classes.rightIcon} />
					</Button>
					<Button color="secondary" onClick={this.deleteThisAppointment}>
						Delete
						<DeleteIcon className={classes.rightIcon} />
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

AppointmentDeletionDialog.propTypes = {
	classes: PropTypes.object.isRequired,
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	appointment: PropTypes.object.isRequired
};

export default withStyles(styles)(AppointmentDeletionDialog);
