import {AuthenticationLoggedIn} from '../../Authentication';

import schema from '../../../lib/schema';
import {patientFields, Patients} from '../../collection/patients';
import {computeUpdate, patients} from '../../patients';
import type TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';

const {sanitize, updateIndex, updateTags} = patients;

export default define({
	name: '/api/patients/insert',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([patientFields.strict()]),
	async transaction(db: TransactionDriver, patient) {
		const owner = this.userId;
		const changes = sanitize(patient);
		const {newState: fields} = await computeUpdate(
			db,
			owner,
			undefined,
			changes,
		);

		await updateTags(db, owner, fields);

		const {insertedId: patientId} = await db.insertOne(Patients, {
			...fields,
			createdAt: new Date(),
			owner,
		});

		await updateIndex(db, owner, patientId, fields);

		return patientId;
	},
	simulate(_patient) {
		return undefined;
	},
});
