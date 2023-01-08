import {check} from 'meteor/check';

import {Patients} from '../../collection/patients';
import {computeUpdate, patients} from '../../patients';
import type TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';

const {sanitize, updateIndex, updateTags} = patients;

export default define({
	name: '/api/patients/insert',
	validate(patient: any) {
		check(patient, Object);
	},
	async transaction(db: TransactionDriver, patient: any) {
		const owner = this.userId;
		const changes = sanitize(patient);
		const {newState: fields} = await computeUpdate(
			db,
			owner,
			undefined,
			changes,
		);

		await updateTags(db, owner, fields);

		const {insertedId: patientId} = await db.insertOne(Patients, {
			...fields,
			createdAt: new Date(),
			owner,
		});

		await updateIndex(db, owner, patientId, fields);

		return patientId;
	},
	simulate(_patient: any) {
		return undefined;
	},
});
