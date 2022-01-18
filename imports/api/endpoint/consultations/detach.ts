import {check} from 'meteor/check';

import {Consultations} from '../../collection/consultations';
import {Attachments} from '../../collection/attachments';

import define from '../define';
import Wrapper from '../../transaction/Wrapper';

export default define({
	name: '/consultations/detach',
	validate(consultationId: string, uploadId: string) {
		check(consultationId, String);
		check(uploadId, String);
	},
	async transaction(db: Wrapper, consultationId: string, uploadId: string) {
		const consultation = await db.findOne(Consultations, {
			_id: consultationId,
			owner: this.userId,
		});
		if (consultation === null) {
			throw new Meteor.Error('not-found', 'consultation not found');
		}

		const result = await db.updateOne(
			Attachments,
			{_id: uploadId, userId: this.userId},
			{
				$pull: {'meta.attachedToConsultations': consultationId},
			},
		);

		if (result.matchedCount === 0) {
			throw new Meteor.Error('not-found', 'attachment not found');
		}

		if (result.matchedCount >= 2) {
			throw new Error('fatal: more than two attachments matched the same _id');
		}

		return result;
	},
	simulate(consultationId: string, uploadId: string) {
		return Attachments.update(uploadId, {
			$pull: {'meta.attachedToConsultations': consultationId},
		});
	},
});
