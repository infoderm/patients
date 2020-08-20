import {Meteor} from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import AppointmentDialog from './AppointmentDialog.js';

const onSubmit = (args, callback) => {
	Meteor.call('appointment.update', args, callback);
};

export default function EditAppointmentDialog({
	open,
	onClose,
	patient,
	appointment
}) {
	return (
		<AppointmentDialog
			open={open}
			initialDatetime={appointment.datetime}
			initialPatient={patient}
			onClose={onClose}
			onSubmit={onSubmit}
		/>
	);
}

EditAppointmentDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	patient: PropTypes.object.isRequired,
	appointment: PropTypes.object.isRequired
};
