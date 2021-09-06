import {check} from 'meteor/check';

import {Appointments} from '../../collection/appointments';

import define from '../define';

export default define({
	name: 'patient.appointmentsAfter',
	cursor(patientId: string, datetime: Date) {
		check(patientId, String);
		check(datetime, Date);
		return Appointments.find({
			owner: this.userId,
			isDone: false,
			patientId,
			datetime: {
				$gte: datetime,
			},
		});
	},
});
