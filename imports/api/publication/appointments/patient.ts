import {check} from 'meteor/check';

import {
	type AppointmentDocument,
	Appointments,
} from '../../collection/appointments';
import type Options from '../../Options';

import define from '../define';

export default define({
	name: 'patient.appointments',
	cursor(patientId: string, options?: Options<AppointmentDocument>) {
		check(patientId, String);
		return Appointments.find(
			{
				owner: this.userId,
				isDone: false,
				patientId,
			},
			options,
		);
	},
});
