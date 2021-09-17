import {check} from 'meteor/check';

import {Consultations} from '../../collection/consultations';
import {Attachments} from '../../collection/attachments';

import define from '../define';
import {availability} from '../../availability';

export default define({
	name: 'consultations.remove',
	validate(consultationId: string) {
		check(consultationId, String);
	},
	run(consultationId: string) {
		const owner = this.userId;
		const consultation = Consultations.findOne({
			_id: consultationId,
			owner,
		});
		if (!consultation) {
			throw new Meteor.Error('not-found');
		}

		Attachments.update(
			{
				userId: this.userId,
				'meta.attachedToConsultations': consultationId,
			},
			{
				$pull: {'meta.attachedToConsultations': consultationId},
			},
			{
				multi: true,
			},
		);

		const returnValue = Consultations.remove(consultationId);

		const {begin, end, isDone, isCancelled} = consultation;
		availability.removeHook(owner, begin, end, isDone || isCancelled ? 0 : 1);

		return returnValue;
	},
});
