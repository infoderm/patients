import {check} from 'meteor/check';

import {Consultations} from '../../collection/consultations';

import define from '../define';

export default define({
	name: 'consultations.transfer',
	validate(consultationId: string, patientId: string) {
		check(consultationId, String);
		check(patientId, String);
	},
	run(consultationId: string, patientId: string) {
		const numUpdated = Consultations.update(
			{
				_id: consultationId,
				owner: this.userId,
			},
			{
				$set: {
					patientId,
				},
				$currentDate: {lastModifiedAt: true},
			},
			{multi: false, upsert: false},
		);

		if (numUpdated === 0) {
			throw new Meteor.Error('not-found');
		}

		return numUpdated;
	},
});
