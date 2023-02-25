import {check} from 'meteor/check';

import {thisYearsInterval} from '../../../lib/datetime';

import {type ConsultationDocument} from '../../collection/consultations';

import {
	findLastConsultationInInterval,
	filterBookPrefill,
} from '../../consultations';

import {Appointments} from '../../collection/appointments';

import {availability} from '../../availability';

import type TransactionDriver from '../../transaction/TransactionDriver';
import unconditionallyUpdateById from '../../unconditionallyUpdateById';

import define from '../define';

export default define({
	name: 'appointments.beginConsultation',
	validate(consultationId: string) {
		check(consultationId, String);
	},
	transaction: unconditionallyUpdateById<ConsultationDocument>(
		Appointments,
		async (db: TransactionDriver, existing: ConsultationDocument) => {
			const {
				owner,
				begin: oldBegin,
				end: oldEnd,
				isDone: oldIsDone,
				isCancelled: oldIsCancelled,
			} = existing;
			const lastConsultationOfThisYear = await findLastConsultationInInterval(
				db,
				thisYearsInterval(),
				{
					...filterBookPrefill(),
					owner,
				},
			);
			const book = lastConsultationOfThisYear?.book;
			const inBookNumber = (lastConsultationOfThisYear?.inBookNumber ?? 0) + 1;
			const realDatetime = new Date();
			const modifier = {
				$set: {
					datetime: realDatetime,
					realDatetime,
					doneDatetime: realDatetime,
					begin: realDatetime,
					end: realDatetime,
					lastModifiedAt: realDatetime,
					isDone: true,
					book,
					inBookNumber,
				},
			};
			const {begin: newBegin, end: newEnd, isDone: newIsDone} = modifier.$set;
			const newIsCancelled = oldIsCancelled;
			const oldWeight = oldIsDone || oldIsCancelled ? 0 : 1;
			const newWeight = newIsDone || newIsCancelled ? 0 : 1;
			await availability.updateHook(
				db,
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
	simulate(_consultationId: string) {
		return undefined;
	},
});
