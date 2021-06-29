import {Meteor} from 'meteor/meteor';

import React from 'react';
import PropTypes, {InferProps} from 'prop-types';

import AppointmentDialog from './AppointmentDialog';

const onSubmit = (args, callback) => {
	Meteor.call('appointments.schedule', args, callback);
};

const propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	noInitialTime: PropTypes.bool,
	initialDatetime: PropTypes.instanceOf(Date).isRequired,
	initialPatient: PropTypes.object
};

export default function NewAppointmentDialog(
	props: InferProps<typeof propTypes>
) {
	return <AppointmentDialog onSubmit={onSubmit} {...props} />;
}

NewAppointmentDialog.propTypes = propTypes;
