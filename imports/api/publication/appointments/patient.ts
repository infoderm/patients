import {check} from 'meteor/check';

import {Appointments} from '../../collection/appointments';

import define from '../define';

export default define({
	name: 'patient.appointments',
	cursor(patientId: string, options) {
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
