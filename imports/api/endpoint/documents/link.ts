import {check} from 'meteor/check';

import {Documents} from '../../collection/documents';
import {Patients} from '../../collection/patients';
import TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';

export default define({
	name: 'documents.link',
	validate(documentId: string, patientId: string) {
		check(documentId, String);
		check(patientId, String);
	},
	async transaction(
		db: TransactionDriver,
		documentId: string,
		patientId: string,
	) {
		const document = await db.findOne(Documents, {_id: documentId});
		if (document === null || document.owner !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own document');
		}

		const patient = await db.findOne(Patients, {_id: patientId});
		if (patient === null || patient.owner !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own patient');
		}

		return db.updateOne(Documents, {_id: documentId}, {$set: {patientId}});
	},
});
