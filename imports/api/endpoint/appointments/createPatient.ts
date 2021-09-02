import {check} from 'meteor/check';

import invoke from '../invoke';
import insertPatient from '../patients/insert';

import define from '../define';

export default define({
	name: 'appointments.createPatient',
	validate(fields: any) {
		check(fields, Object);
	},
	async run(fields: any) {
		const patient = {
			...fields,
			createdForAppointment: true,
		};
		const patientId = await invoke(insertPatient, this, [patient]);
		console.debug(`Created patient #${patientId} for new appointment.`);
		return patientId;
	},
});
