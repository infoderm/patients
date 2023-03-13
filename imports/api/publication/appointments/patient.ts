import schema from '../../../lib/schema';
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
	schema: schema.tuple([
		schema.string(),
		schema
			.object({
				/* TODO Options<AppointmentDocument> */
			})
			.optional(),
	]),
	cursor(patientId, options?: Options<AppointmentDocument>) {
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
