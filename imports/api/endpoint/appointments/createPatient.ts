import insertPatient from '../patients/insert';

import compose from '../compose';
import define from '../define';
import type TransactionDriver from '../../transaction/TransactionDriver';
import {AuthenticationLoggedIn} from '../../Authentication';
import schema from '../../../lib/schema';

export default define({
	name: 'appointments.createPatient',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.object({})]),
	async transaction(db: TransactionDriver, fields) {
		const patient = {
			...fields,
			createdForAppointment: true,
		};
		const patientId = await compose(db, insertPatient, this, [patient]);
		console.debug(`Created patient #${patientId} for new appointment.`);
		return patientId;
	},
});
