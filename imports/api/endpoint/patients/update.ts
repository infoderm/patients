import {check} from 'meteor/check';

import {Patients} from '../../collection/patients';
import {patients} from '../../patients';
import TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';

const {sanitize, updateIndex, updateTags} = patients;

export default define({
	name: '/api/patients/update',
	validate(patientId: string, newfields: any) {
		check(patientId, String);
		check(newfields, Object);
	},
	async transaction(db: TransactionDriver, patientId: string, newfields: any) {
		const patient = await db.findOne(Patients, {
			_id: patientId,
			owner: this.userId,
		});

		if (patient === null) {
			throw new Meteor.Error('not-found');
		}

		const fields = sanitize(newfields);

		await updateTags(db, this.userId, fields);

		await updateIndex(db, this.userId, patientId, fields);

		return db.updateOne(Patients, {_id: patientId}, {$set: fields});
	},
	simulate(patientId: string, newfields: any) {
		const fields = sanitize(newfields);
		return Patients.update(patientId, {$set: fields});
	},
});
