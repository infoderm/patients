import {check} from 'meteor/check';
import {Mongo} from 'meteor/mongo';

import addMilliseconds from 'date-fns/addMilliseconds';

import {
	ConsultationDocument,
	Consultations,
} from '../../collection/consultations';
import unconditionallyUpdateById from '../../unconditionallyUpdateById';

import define from '../define';
import {availability} from '../../availability';

export default define({
	name: 'consultations.restoreAppointment',
	validate(consultationId: string) {
		check(consultationId, String);
	},
	run: unconditionallyUpdateById(Consultations, (existing) => {
		const modifier: Mongo.Modifier<ConsultationDocument> = {
			$set: {
				datetime: existing.scheduledDatetime,
				begin: existing.scheduledDatetime,
				end: addMilliseconds(existing.scheduledDatetime, existing.duration),
				isDone: false,
			},
			$currentDate: {lastModifiedAt: true},
		};
		const {
			owner,
			begin: oldBegin,
			end: oldEnd,
			isDone: oldIsDone,
			isCancelled: oldIsCancelled,
		} = existing;
		const {begin: newBegin, end: newEnd, isDone: newIsDone} = modifier.$set;
		const newIsCancelled = oldIsCancelled;
		const oldWeight = oldIsDone || oldIsCancelled ? 0 : 1;
		const newWeight = newIsDone || newIsCancelled ? 0 : 1;
		availability.updateHook(
			owner,
			oldBegin,
			oldEnd,
			oldWeight,
			newBegin,
			newEnd,
			newWeight,
		);
		return modifier;
	}),
});
