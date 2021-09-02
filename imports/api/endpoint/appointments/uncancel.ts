import {check} from 'meteor/check';

import {Appointments} from '../../appointments';

import unconditionallyUpdateById from '../../unconditionallyUpdateById';

import define from '../define';

export default define({
	name: 'appointments.uncancel',
	validate(consultationId: string) {
		check(consultationId, String);
	},
	run: unconditionallyUpdateById(Appointments, {
		$set: {isCancelled: false},
	}),
});
