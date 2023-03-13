import {check} from 'meteor/check';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Patients} from '../../collection/patients';
import {computeUpdate, patients} from '../../patients';
import type TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';
import EndpointError from '../EndpointError';

const {sanitize, updateIndex, updateTags} = patients;

export default define({
	name: '/api/patients/update',
	authentication: AuthenticationLoggedIn,
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
	simulate(_patientId: string, _newfields: any) {
		return undefined;
	},
});
