import schema from '../../../util/schema';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Consultations} from '../../collection/consultations';

import define from '../define';
import EndpointError from '../EndpointError';

export default define({
	name: 'consultations.transfer',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string(), schema.string()]),
	async run(consultationId, patientId) {
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
			throw new EndpointError('not-found');
		}

		return numUpdated;
	},
});
