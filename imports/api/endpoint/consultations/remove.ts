import {Consultations} from '../../collection/consultations';
import {Attachments} from '../../collection/attachments';

import define from '../define';
import {availability} from '../../availability';
import type TransactionDriver from '../../transaction/TransactionDriver';
import {AuthenticationLoggedIn} from '../../Authentication';
import schema from '../../../lib/schema';

export default define({
	name: 'consultations.remove',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string()]),
	async transaction(db: TransactionDriver, consultationId) {
		const owner = this.userId;
		const consultation = await db.findOne(Consultations, {
			_id: consultationId,
			owner,
		});
		if (consultation === null) {
			throw new Meteor.Error('not-found');
		}

		await db.updateMany(
			Attachments,
			{
				userId: this.userId,
				'meta.attachedToConsultations': consultationId,
			},
			{
				$pull: {'meta.attachedToConsultations': consultationId},
			},
		);

		const {begin, end, isDone, isCancelled} = consultation;
		await availability.removeHook(
			db,
			owner,
			begin,
			end,
			isDone || isCancelled ? 0 : 1,
		);

		return db.deleteOne(Consultations, {_id: consultationId});
	},
});
