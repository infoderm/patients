import {check} from 'meteor/check';

import {PatientDocument, Patients} from '../../collection/patients';
import {computeUpdate, patients} from '../../patients';
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

		const changes = sanitize(newfields);
		const {$set, $unset, newState} = await computeUpdate(
			db,
			owner,
			patient,
			changes,
		);

		await updateTags(db, owner, $set);

		await updateIndex(db, owner, patientId, newState);

		const modifier: Mongo.Modifier<PatientDocument> = {};

		if (Object.keys($set).length > 0) modifier.$set = $set;
		if (Object.keys($unset).length > 0) modifier.$unset = $unset;

		return db.updateOne(Patients, {_id: patientId, owner}, modifier);
	},
	simulate(_patientId: string, _newfields: any) {
		return undefined;
	},
});
