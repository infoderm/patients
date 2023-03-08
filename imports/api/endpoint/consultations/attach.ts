import {Consultations} from '../../collection/consultations';
import {Attachments} from '../../collection/attachments';

import define from '../define';
import type TransactionDriver from '../../transaction/TransactionDriver';
import {AuthenticationLoggedIn} from '../../Authentication';
import EndpointError from '../EndpointError';
import schema from '../../../lib/schema';

export default define({
	name: '/consultations/attach',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string(), schema.string()]),
	async transaction(db: TransactionDriver, consultationId, uploadId) {
		const consultation = await db.findOne(Consultations, {
			_id: consultationId,
			owner: this.userId,
		});
		if (consultation === null) {
			throw new EndpointError('not-found', 'consultation not found');
		}

		const result = await db.updateOne(
			Attachments,
			{_id: uploadId, userId: this.userId},
			{
				$addToSet: {'meta.attachedToConsultations': consultationId},
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
	async simulate(consultationId, uploadId) {
		await Attachments.updateAsync(uploadId, {
			$addToSet: {'meta.attachedToConsultations': consultationId},
		});
		return undefined;
	},
});
