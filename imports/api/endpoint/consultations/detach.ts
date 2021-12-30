import {check} from 'meteor/check';

import {Consultations} from '../../collection/consultations';
import {Attachments} from '../../collection/attachments';

import executeTransaction from '../../transaction/executeTransaction';

import define from '../define';

export default define({
	name: '/consultations/detach',
	validate(consultationId: string, uploadId: string) {
		check(consultationId, String);
		check(uploadId, String);
	},
	async run(consultationId: string, uploadId: string) {
		return executeTransaction(async ({findOne, updateOne}) => {
			const consultation = await findOne(Consultations, {
				_id: consultationId,
				owner: this.userId,
			});
			if (!consultation) {
				throw new Meteor.Error('not-found', 'consultation not found');
			}

			const result = await updateOne(
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
				throw new Error(
					'fatal: more than two attachments matched the same _id',
				);
			}

			return result;
		});
	},
	simulate(consultationId: string, uploadId: string) {
		return Attachments.update(uploadId, {
			$pull: {'meta.attachedToConsultations': consultationId},
		});
	},
});
