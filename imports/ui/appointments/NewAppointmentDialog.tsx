import React from 'react';
import schedule from '../../api/endpoint/appointments/schedule';
import call from '../../api/endpoint/call';

import PropsOf from '../../util/PropsOf';

import AppointmentDialog from './AppointmentDialog';
import AppointmentFromPatientIdDialog from './AppointmentFromPatientIdDialog';

const onSubmit = async (args) => call(schedule, args);

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
