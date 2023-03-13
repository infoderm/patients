import {check} from 'meteor/check';
import {AuthenticationLoggedIn} from '../../Authentication';

import {
	type AppointmentDocument,
	Appointments,
} from '../../collection/appointments';
import type Options from '../../Options';

import define from '../define';

export default define({
	name: 'patient.appointments',
	authentication: AuthenticationLoggedIn,
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
