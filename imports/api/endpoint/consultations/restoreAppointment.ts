import addMilliseconds from 'date-fns/addMilliseconds';

import {
	type ConsultationDocument,
	Consultations,
} from '../../collection/consultations';
import unconditionallyUpdateById from '../../unconditionallyUpdateById';

import define from '../define';
import {availability} from '../../availability';
import type TransactionDriver from '../../transaction/TransactionDriver';
import type Modifier from '../../Modifier';
import {AuthenticationLoggedIn} from '../../Authentication';
import schema from '../../../util/schema';

export default define({
	name: 'consultations.restoreAppointment',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string()]),
	transaction: unconditionallyUpdateById(
		Consultations,
		async (db: TransactionDriver, existing) => {
			const modifier = {
				$set: {
					datetime: existing.scheduledDatetime!,
					begin: existing.scheduledDatetime!,
					end: addMilliseconds(existing.scheduledDatetime!, existing.duration!),
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
			return modifier as Modifier<ConsultationDocument>;
		},
	),
	simulate(_consultationId) {
		return undefined;
	},
});
