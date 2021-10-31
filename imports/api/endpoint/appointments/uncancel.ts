import {check} from 'meteor/check';
import {Mongo} from 'meteor/mongo';
import {availability} from '../../availability';

import {Appointments} from '../../collection/appointments';
import {ConsultationDocument} from '../../collection/consultations';

import unconditionallyUpdateById from '../../unconditionallyUpdateById';

import define from '../define';

export default define({
	name: 'appointments.uncancel',
	validate(consultationId: string) {
		check(consultationId, String);
	},
	run: unconditionallyUpdateById<ConsultationDocument>(
		Appointments,
		(existing) => {
			const modifier: Mongo.Modifier<ConsultationDocument> = {
				$set: {
					isCancelled: false,
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
			const {isCancelled: newIsCancelled} = modifier.$set;
			const newBegin = oldBegin;
			const newEnd = oldEnd;
			const newIsDone = oldIsDone;
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
		},
	),
});
