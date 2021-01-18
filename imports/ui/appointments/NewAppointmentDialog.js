import {Meteor} from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import AppointmentDialog from './AppointmentDialog.js';

const onSubmit = (args, callback) => {
	Meteor.call('appointments.schedule', args, callback);
};

export default function NewAppointmentDialog(props) {
	return <AppointmentDialog onSubmit={onSubmit} {...props} />;
}

NewAppointmentDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	initialDatetime: PropTypes.instanceOf(Date).isRequired,
	initialPatient: PropTypes.object
};
