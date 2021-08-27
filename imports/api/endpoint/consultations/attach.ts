import {check} from 'meteor/check';

import {Consultations} from '../../consultations';
import {Attachments} from '../../attachments';

import executeTransaction from '../../transaction/executeTransaction';

import define from '../define';

export default define({
	name: '/consultations/attach',
	validate(consultationId: string, uploadId: string) {
		check(consultationId, String);
		check(uploadId, String);
	},
	async run(consultationId: string, uploadId: string) {
		return executeTransaction(async (session) => {
			const consultation = await Consultations.rawCollection().findOne(
				{_id: consultationId, owner: this.userId},
				{session},
			);
			if (!consultation) {
				throw new Meteor.Error('not-found', 'consultation not found');
			}

			const result = await Attachments.rawCollection().updateOne(
				{_id: uploadId, userId: this.userId},
				{
					$addToSet: {'meta.attachedToConsultations': consultationId},
				},
				{session},
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
});
