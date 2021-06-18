import {Meteor} from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import usePatient from '../patients/usePatient';
import withLazyOpening from '../modal/withLazyOpening';
import AppointmentDialog from './AppointmentDialog';

const EditAppointmentDialog = ({open, onClose, appointment}) => {
	const onSubmit = (args, callback) => {
		Meteor.call('appointments.reschedule', appointment._id, args, callback);
	};

	const patientId = appointment.patientId;
	const options = {fields: {firstname: 1, lastname: 1, phone: 1}};

	const deps = [patientId, JSON.stringify(options.fields)];

	const {loading, found, fields} = usePatient(
		{_id: patientId},
		patientId,
		options,
		deps
	);

	const patient = loading
		? {_id: patientId, lastname: 'loading', firstname: '...'}
		: found
		? fields
		: {_id: patientId, lastname: 'NOT', firstname: 'FOUND'};

	return (
		<AppointmentDialog
			open={open}
			initialDatetime={appointment.datetime}
			initialPatient={patient}
			initialAppointment={appointment}
			onClose={onClose}
			onSubmit={onSubmit}
		/>
	);
};

EditAppointmentDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	appointment: PropTypes.object.isRequired
};

export default withLazyOpening(EditAppointmentDialog);
