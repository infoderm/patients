import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';

import {
	type AppointmentDocument,
	Appointments,
	appointmentDocument,
} from '../../collection/appointments';
import {options} from '../../query/Options';
import type Options from '../../query/Options';

import define from '../define';

export default define({
	name: 'patient.appointments',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([
		schema.string(),
		options(appointmentDocument).nullable(),
	]),
	cursor(patientId, options: Options<AppointmentDocument> | null) {
		return Appointments.find(
			{
				owner: this.userId,
				isDone: false,
				patientId,
			},
			options ?? undefined,
		);
	},
});
