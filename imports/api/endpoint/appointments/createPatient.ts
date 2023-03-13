import {check} from 'meteor/check';

import insertPatient from '../patients/insert';

import compose from '../compose';
import define from '../define';
import type TransactionDriver from '../../transaction/TransactionDriver';
import {AuthenticationLoggedIn} from '../../Authentication';

export default define({
	name: 'appointments.createPatient',
	authentication: AuthenticationLoggedIn,
	validate(fields: any) {
		check(fields, Object);
	},
	async transaction(db: TransactionDriver, fields: any) {
		const patient = {
			...fields,
			createdForAppointment: true,
		};
		const patientId = await compose(db, insertPatient, this, [patient]);
		console.debug(`Created patient #${patientId} for new appointment.`);
		return patientId;
	},
});
