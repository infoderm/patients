import React from 'react';
import schedule from '../../api/endpoint/appointments/schedule';

import PropsOf from '../../util/PropsOf';
import useCall from '../action/useCall';

import AppointmentDialog from './AppointmentDialog';
import AppointmentFromPatientIdDialog from './AppointmentFromPatientIdDialog';

const NewAppointmentDialog = (
	props:
		| Omit<PropsOf<typeof AppointmentDialog>, 'onSubmit' | 'pending'>
		| Omit<
				PropsOf<typeof AppointmentFromPatientIdDialog>,
				'onSubmit' | 'pending'
		  >,
) => {
	const [call, {pending}] = useCall();
	const onSubmit = async (args) => call(schedule, args);
	return 'patientId' in props && props.patientId !== undefined ? (
		<AppointmentFromPatientIdDialog
			pending={pending}
			onSubmit={onSubmit}
			{...props}
		/>
	) : (
		<AppointmentDialog pending={pending} onSubmit={onSubmit} {...props} />
	);
};

export default NewAppointmentDialog;
