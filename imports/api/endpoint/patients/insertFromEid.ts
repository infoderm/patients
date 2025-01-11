import {AuthenticationLoggedIn} from '../../Authentication';

import schema from '../../../lib/schema';
import {eidFields, Eids} from '../../collection/eids';
import {patientFieldsFromEid} from '../../patients';
import type TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';
import compose from '../compose';

import insert from './insert';

export default define({
	name: '/api/patients/insertFromEid',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([eidFields.strict()]),
	async transaction(db: TransactionDriver, eid) {
		const owner = this.userId;

		const lastUsedAt = new Date();

		await db.updateOne(
			Eids,
			{
				owner,
				...eid,
			},
			{
				$set: {
					lastUsedAt,
				},
				$setOnInsert: {
					createdAt: lastUsedAt,
				},
			},
			{
				upsert: true,
			},
		);

		const patient = patientFieldsFromEid(eid);

		return compose(db, insert, this, [patient]);
	},
	simulate(_patient) {
		return undefined;
	},
});
