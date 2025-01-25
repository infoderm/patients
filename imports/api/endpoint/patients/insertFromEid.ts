import {AuthenticationLoggedIn} from '../../Authentication';

import schema from '../../../lib/schema';
import {eidFields, Eids} from '../../collection/eids';
import {patientFieldsFromEid} from '../../patients';
import type TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';

import {Changes} from '../../collection/changes';

import {_insert} from './insert';

export default define({
	name: '/api/patients/insertFromEid',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([eidFields.strict()]),
	async transaction(db: TransactionDriver, eid) {
		const owner = this.userId;

		const lastUsedAt = new Date();

		const {_id: eidId} = (await db.findOneAndUpdate(
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
				returnDocument: 'after',
				projection: {
					_id: 1,
				},
			},
		))!;

		const fields = patientFieldsFromEid(eid);

		const {_id: patientId, ...$set} = await _insert(db, owner, fields);

		await db.insertOne(Changes, {
			owner,
			when: lastUsedAt,
			who: {
				type: 'user',
				_id: owner,
			},
			why: {
				method: 'insertFromEid',
				source: {
					type: 'entity',
					collection: 'eid',
					_id: eidId,
				},
			},
			what: {
				type: 'patient',
				_id: patientId,
			},
			operation: {
				type: 'create',
				$set,
			},
		});

		return patientId;
	},
	simulate(_patient) {
		return undefined;
	},
});
