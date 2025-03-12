import {AuthenticationLoggedIn} from '../../Authentication';
import schema from '../../../util/schema';

import {
	patientUpdate,
	Patients,
	type PatientUpdate,
} from '../../collection/patients';
import {computeUpdate, patients} from '../../patients';
import type TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';
import EndpointError from '../EndpointError';
import {Changes} from '../../collection/changes';

const {sanitize, updateIndex, updateTags} = patients;

export const _update = async (
	db: TransactionDriver,
	owner: string,
	patientId: string,
	documentUpdate: PatientUpdate,
) => {
	const patient = await db.findOne(Patients, {
		_id: patientId,
		owner,
	});

	if (patient === null) {
		throw new EndpointError('not-found');
	}

	const changes = sanitize(documentUpdate);
	const {$set, $unset, newState} = await computeUpdate(
		db,
		owner,
		patient,
		changes,
	);

	if ($set !== undefined) await updateTags(db, owner, $set);

	await updateIndex(db, owner, patientId, newState, $unset);

	const result = await db.updateOne(
		Patients,
		{_id: patientId, owner},
		{$set, $unset},
	);

	return {
		result,
		$set,
		$unset,
	};
};

export default define({
	name: '/api/patients/update',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string(), patientUpdate.strict()]),
	async transaction(db: TransactionDriver, patientId, documentUpdate) {
		const owner = this.userId;

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
					method: 'update',
					source: {
						type: 'manual',
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
	simulate(_patientId, _newfields) {
		return undefined;
	},
});
