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
		const owner = this.userId;

		const patient = await db.findOne(Patients, {
			_id: patientId,
			owner,
		});

		if (patient === null) {
			throw new Meteor.Error('not-found');
		}

		const fields = sanitize(newfields);

		await updateTags(db, owner, fields);

		await updateIndex(db, owner, patientId, fields);

		return db.updateOne(Patients, {_id: patientId, owner}, {$set: fields});
	},
	simulate(_patientId: string, _newfields: any) {
		return undefined;
	},
});
