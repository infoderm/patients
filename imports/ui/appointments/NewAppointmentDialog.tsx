import {Meteor} from 'meteor/meteor';

import React from 'react';

import PropsOf from '../../util/PropsOf';

import AppointmentDialog from './AppointmentDialog';
import AppointmentFromPatientIdDialog from './AppointmentFromPatientIdDialog';

const onSubmit = (args, callback) => {
	Meteor.call('appointments.schedule', args, callback);
};

export default function NewAppointmentDialog(
	props:
		| PropsOf<typeof AppointmentDialog>
		| PropsOf<typeof AppointmentFromPatientIdDialog>,
) {
	return props.patientId === undefined ? (
		<AppointmentDialog onSubmit={onSubmit} {...props} />
	) : (
		<AppointmentFromPatientIdDialog onSubmit={onSubmit} {...props} />
	);
}
