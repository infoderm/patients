import {AuthenticationLoggedIn} from '../../Authentication';
import schema from '../../../lib/schema';

import {patientUpdate, Patients} from '../../collection/patients';
import {computeUpdate, patients} from '../../patients';
import type TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';
import EndpointError from '../EndpointError';

const {sanitize, updateIndex, updateTags} = patients;

export default define({
	name: '/api/patients/update',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string(), patientUpdate.strict()]),
	async transaction(db: TransactionDriver, patientId, newfields) {
		const owner = this.userId;

		const patient = await db.findOne(Patients, {
			_id: patientId,
			owner,
		});

		if (patient === null) {
			throw new EndpointError('not-found');
		}

		const changes = sanitize(newfields);
		const {$set, $unset, newState} = await computeUpdate(
			db,
			owner,
			patient,
			changes,
		);

		if ($set !== undefined) await updateTags(db, owner, $set);

		await updateIndex(db, owner, patientId, newState, $unset);

		return db.updateOne(Patients, {_id: patientId, owner}, {$set, $unset});
	},
	simulate(_patientId, _newfields) {
		return undefined;
	},
});
