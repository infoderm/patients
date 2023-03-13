import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Attachments} from '../../collection/attachments';

import define from '../define';

export default define({
	name: 'patient.attachments',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string()]),
	cursor(patientId) {
		const selector = {
			'meta.attachedToPatients': patientId,
			userId: this.userId,
		};
		return Attachments.find(selector);
	},
});
