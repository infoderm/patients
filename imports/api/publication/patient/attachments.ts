import {check} from 'meteor/check';

import {Attachments} from '../../collection/attachments';

import define from '../define';

export default define({
	name: 'patient.attachments',
	cursor(patientId: string) {
		check(patientId, String);
		const selector = {
			'meta.attachedToPatients': patientId,
			userId: this.userId,
		};
		return Attachments.find(selector);
	},
});
