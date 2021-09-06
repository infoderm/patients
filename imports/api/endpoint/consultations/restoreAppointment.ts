import {check} from 'meteor/check';

import addMilliseconds from 'date-fns/addMilliseconds';

import {Consultations} from '../../collection/consultations';
import unconditionallyUpdateById from '../../unconditionallyUpdateById';

import define from '../define';

export default define({
	name: 'consultations.restoreAppointment',
	validate(consultationId: string) {
		check(consultationId, String);
	},
	run: unconditionallyUpdateById(Consultations, (existing) => ({
		$set: {
			datetime: existing.scheduledDatetime,
			begin: existing.scheduledDatetime,
			end: addMilliseconds(existing.scheduledDatetime, existing.duration),
			isDone: false,
		},
	})),
});
