import {check} from 'meteor/check';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Consultations} from '../../collection/consultations';

import define from '../define';

export default define({
	name: 'consultations.transfer',
	authentication: AuthenticationLoggedIn,
	validate(consultationId: string, patientId: string) {
		check(consultationId, String);
		check(patientId, String);
	},
	async run(consultationId: string, patientId: string) {
		const numUpdated = await Consultations.updateAsync(
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
