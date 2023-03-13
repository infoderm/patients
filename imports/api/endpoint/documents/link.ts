import {check} from 'meteor/check';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Documents} from '../../collection/documents';
import {Patients} from '../../collection/patients';
import type TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';
import EndpointError from '../EndpointError';

export default define({
	name: 'documents.link',
	authentication: AuthenticationLoggedIn,
	validate(documentId: string, patientId: string) {
		check(documentId, String);
		check(patientId, String);
	},
	async transaction(
		db: TransactionDriver,
		documentId: string,
		patientId: string,
	) {
		const document = await db.findOne(Documents, {
			_id: documentId,
			owner: this.userId,
		});
		if (document === null) {
			throw new EndpointError('not-found', 'user does not own document');
		}

		const patient = await db.findOne(Patients, {
			_id: patientId,
			owner: this.userId,
		});
		if (patient === null) {
			throw new EndpointError('not-found', 'user does not own patient');
		}

		return db.updateOne(Documents, {_id: documentId}, {$set: {patientId}});
	},
});
