import {AuthenticationLoggedIn} from '../../Authentication';

import schema from '../../../lib/schema';
import {
	type PatientFields,
	patientFields,
	Patients,
} from '../../collection/patients';
import {Changes} from '../../collection/changes';
import {computeUpdate, patients} from '../../patients';
import type TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';

const {sanitize, updateIndex, updateTags} = patients;

export const _insert = async (
	db: TransactionDriver,
	owner: string,
	fields: PatientFields,
) => {
	const changes = sanitize(fields);
	const {newState} = await computeUpdate(db, owner, undefined, changes);

	const patient = {
		...newState,
		createdAt: new Date(),
		owner,
	};
	await updateTags(db, owner, patient);
	const {insertedId: patientId} = await db.insertOne(Patients, patient);
	await updateIndex(db, owner, patientId, patient);
	return {
		...patient,
		_id: patientId,
	};
};

export default define({
	name: '/api/patients/insert',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([patientFields.strict()]),
	async transaction(db: TransactionDriver, fields) {
		const owner = this.userId;

		const {_id: patientId, ...$set} = await _insert(db, owner, fields);

		await db.insertOne(Changes, {
			owner,
			when: $set.createdAt,
			who: {
				type: 'user',
				_id: owner,
			},
			why: {
				method: 'insert',
				source: {
					type: 'manual',
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
