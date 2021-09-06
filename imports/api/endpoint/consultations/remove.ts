import {check} from 'meteor/check';

import {Consultations} from '../../collection/consultations';
import {Attachments} from '../../collection/attachments';

import define from '../define';

export default define({
	name: 'consultations.remove',
	validate(consultationId: string) {
		check(consultationId, String);
	},
	run(consultationId: string) {
		const consultation = Consultations.findOne({
			_id: consultationId,
			owner: this.userId,
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

		return Consultations.remove(consultationId);
	},
});
