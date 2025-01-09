import {AuthenticationLoggedIn} from '../../Authentication';

import schema from '../../../lib/schema';
import {eidFields, Eids} from '../../collection/eids';
import {patientFieldsFromEid} from '../../patients';
import type TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';
import compose from '../compose';

import update from './update';

export default define({
	name: '/api/patients/updateFromEid',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string(), eidFields.strict()]),
	async transaction(db: TransactionDriver, patientId, eid) {
		const owner = this.userId;

		await db.insertOne(Eids, {
			...eid,
			createdAt: new Date(),
			owner,
		});

		const changes = patientFieldsFromEid(eid);

		return compose(db, update, this, [patientId, changes]);
	},
	simulate(_patient) {
		return undefined;
	},
});
