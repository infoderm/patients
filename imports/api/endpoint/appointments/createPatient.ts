import {check} from 'meteor/check';

import insertPatient from '../patients/insert';

import compose from '../compose';
import define from '../define';
import Wrapper from '../../transaction/Wrapper';

export default define({
	name: 'appointments.createPatient',
	validate(fields: any) {
		check(fields, Object);
	},
	async transaction(db: Wrapper, fields: any) {
		const patient = {
			...fields,
			createdForAppointment: true,
		};
		const patientId = await compose(db, insertPatient, this, [patient]);
		console.debug(`Created patient #${patientId} for new appointment.`);
		return patientId;
	},
});
