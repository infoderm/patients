import {check} from 'meteor/check';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Attachments} from '../../collection/attachments';

import define from '../define';

export default define({
	name: 'patient.attachments',
	authentication: AuthenticationLoggedIn,
	cursor(patientId: string) {
		check(patientId, String);
		const selector = {
			'meta.attachedToPatients': patientId,
			userId: this.userId,
		};
		return Attachments.find(selector);
	},
});
