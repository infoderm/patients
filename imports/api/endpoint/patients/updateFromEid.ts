import {AuthenticationLoggedIn} from '../../Authentication';

import schema from '../../../lib/schema';
import {eidFields, Eids} from '../../collection/eids';
import {patientFieldsFromEid} from '../../patients';
import type TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';

import {Changes} from '../../collection/changes';

import {_update} from './update';

export default define({
	name: '/api/patients/updateFromEid',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string(), eidFields.strict()]),
	async transaction(db: TransactionDriver, patientId, eid) {
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

		const documentUpdate = patientFieldsFromEid(eid);

		const {result, $set, $unset} = await _update(
			db,
			owner,
			patientId,
			documentUpdate,
		);

		if (result.modifiedCount >= 1) {
			await db.insertOne(Changes, {
				owner,
				when: new Date(),
				who: {
					type: 'user',
					_id: owner,
				},
				why: {
					method: 'updateFromEid',
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
					type: 'update',
					$set,
					$unset,
				},
			});
		}

		return result;
	},
	simulate(_patient) {
		return undefined;
	},
});
