import {check} from 'meteor/check';

import {thisYearsInterval} from '../../../util/datetime';

import {ConsultationDocument} from '../../collection/consultations';

import {
	findLastConsultationInInterval,
	filterNotInRareBooks,
} from '../../consultations';

import {Appointments} from '../../collection/appointments';

import unconditionallyUpdateById from '../../unconditionallyUpdateById';

import define from '../define';
import {availability} from '../../availability';

export default define({
	name: 'appointments.beginConsultation',
	validate(consultationId: string) {
		check(consultationId, String);
	},
	run: unconditionallyUpdateById<ConsultationDocument>(
		Appointments,
		(existing: ConsultationDocument) => {
			const {
				owner,
				begin: oldBegin,
				end: oldEnd,
				isDone: oldIsDone,
				isCancelled: oldIsCancelled,
			} = existing;
			const book = findLastConsultationInInterval(thisYearsInterval(), {
				...filterNotInRareBooks(),
				owner,
			})?.book;
			const realDatetime = new Date();
			const modifier = {
				$set: {
					datetime: realDatetime,
					realDatetime,
					doneDatetime: realDatetime,
					begin: realDatetime,
					end: realDatetime,
					isDone: true,
					book,
				},
			};
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
		},
	),
});
