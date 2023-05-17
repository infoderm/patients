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
import {AuthenticationLoggedIn} from '../../Authentication';
import schema from '../../../lib/schema';
import {books} from '../../books';

export default define({
	name: 'appointments.beginConsultation',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string()]),
	transaction: unconditionallyUpdateById(
		Appointments,
		async (db: TransactionDriver, existing: ConsultationDocument) => {
			const {
				owner,
				begin: oldBegin,
				end: oldEnd,
				isDone: oldIsDone,
				isCancelled: oldIsCancelled,
			} = existing;
			const lastRealBookConsultationOfThisYear =
				await findLastConsultationInInterval(db, thisYearsInterval(), {
					...filterBookPrefill(),
					owner,
				});
			const book = lastRealBookConsultationOfThisYear?.book ?? '1';
			const inBookNumber =
				(lastRealBookConsultationOfThisYear?.inBookNumber ?? 0) + 1;
			const realDatetime = new Date();

			if (book === '1' && inBookNumber === 1) {
				await books.add(db, owner, books.name(realDatetime, book));
			}

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
	simulate(_consultationId) {
		return undefined;
	},
});
