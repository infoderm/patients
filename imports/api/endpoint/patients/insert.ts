import {check} from 'meteor/check';

import {Patients} from '../../collection/patients';
import {patients} from '../../patients';
import TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';

const {sanitize, updateIndex, updateTags} = patients;

export default define({
	name: '/api/patients/insert',
	validate(patient: any) {
		check(patient, Object);
	},
	async transaction(db: TransactionDriver, patient: any) {
		const fields = sanitize(patient);

		await updateTags(db, this.userId, fields);

		const {insertedId: patientId} = await db.insertOne(Patients, {
			...fields,
			createdAt: new Date(),
			owner: this.userId,
		});

		await updateIndex(db, this.userId, patientId, fields);

		return patientId;
	},
	simulate(patient: any) {
		const fields = sanitize(patient);
		return Patients.insert({
			...fields,
			createdAt: new Date(),
			owner: this.userId,
		});
	},
});
