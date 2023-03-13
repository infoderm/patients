import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Appointments} from '../../collection/appointments';

import define from '../define';

export default define({
	name: 'patient.appointmentsAfter',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string(), schema.date()]),
	cursor(patientId, datetime) {
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
