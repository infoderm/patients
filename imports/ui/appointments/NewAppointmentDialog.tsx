import React from 'react';
import schedule from '../../api/endpoint/appointments/schedule';
import call from '../../api/endpoint/call';

import PropsOf from '../../util/PropsOf';

import AppointmentDialog from './AppointmentDialog';
import AppointmentFromPatientIdDialog from './AppointmentFromPatientIdDialog';

const onSubmit = async (args) => call(schedule, args);

const NewAppointmentDialog = (
	props:
		| Omit<PropsOf<typeof AppointmentDialog>, 'onSubmit'>
		| Omit<PropsOf<typeof AppointmentFromPatientIdDialog>, 'onSubmit'>,
) => {
	return 'patientId' in props ? (
		<AppointmentFromPatientIdDialog onSubmit={onSubmit} {...props} />
	) : (
		<AppointmentDialog onSubmit={onSubmit} {...props} />
	);
};

export default NewAppointmentDialog;
