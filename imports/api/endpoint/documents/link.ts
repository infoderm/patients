import schema from '../../../util/schema';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Documents} from '../../collection/documents';
import {Patients} from '../../collection/patients';
import type TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';
import EndpointError from '../EndpointError';

export default define({
	name: 'documents.link',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string(), schema.string()]),
	async transaction(db: TransactionDriver, documentId, patientId) {
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
