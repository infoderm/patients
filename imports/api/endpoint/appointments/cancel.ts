import {type ConsultationDocument} from '../../collection/consultations';

import {Appointments} from '../../collection/appointments';

import {availability} from '../../availability';

import type TransactionDriver from '../../transaction/TransactionDriver';
import unconditionallyUpdateById from '../../unconditionallyUpdateById';

import define from '../define';
import type Modifier from '../../Modifier';
import {AuthenticationLoggedIn} from '../../Authentication';
import schema from '../../../lib/schema';

export default define({
	name: 'appointments.cancel',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string(), schema.string(), schema.string()]),
	transaction: unconditionallyUpdateById(
		Appointments,
		async (
			db: TransactionDriver,
			existing,
			cancellationReason,
			cancellationExplanation,
		) => {
			const modifier = {
				$set: {
					isCancelled: true,
					cancellationReason,
					cancellationExplanation,
				},
				$currentDate: {
					cancellationDatetime: true,
					lastModifiedAt: true,
				},
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
	simulate(
		_consultationId: string,
		_cancellationReason: string,
		_cancellationExplanation: string,
	) {
		return undefined;
	},
});
