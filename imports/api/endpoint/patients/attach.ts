import {Patients} from '../../collection/patients';
import {Attachments} from '../../collection/attachments';

import type TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';
import EndpointError from '../EndpointError';
import {AuthenticationLoggedIn} from '../../Authentication';
import schema from '../../../util/schema';

export default define({
	name: '/patients/attach',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string(), schema.string()]),
	async transaction(db: TransactionDriver, patientId, uploadId) {
		const patient = await db.findOne(Patients, {
			_id: patientId,
			owner: this.userId,
		});
		if (patient === null) {
			throw new EndpointError('not-found', 'patient not found');
		}

		const result = await db.updateOne(
			Attachments,
			{_id: uploadId, userId: this.userId},
			{
				$addToSet: {'meta.attachedToPatients': patientId},
			},
		);

		if (result.matchedCount === 0) {
			throw new EndpointError('not-found', 'attachment not found');
		}

		if (result.matchedCount >= 2) {
			throw new Error('fatal: more than two attachments matched the same _id');
		}

		return result;
	},
	async simulate(patientId, uploadId) {
		await Attachments.updateAsync(uploadId, {
			$addToSet: {'meta.attachedToPatients': patientId},
		});
		return undefined;
	},
});
