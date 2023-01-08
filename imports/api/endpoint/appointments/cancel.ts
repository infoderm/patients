import {check} from 'meteor/check';
import {type Mongo} from 'meteor/mongo';

import {type ConsultationDocument} from '../../collection/consultations';

import {Appointments} from '../../collection/appointments';

import {availability} from '../../availability';

import type TransactionDriver from '../../transaction/TransactionDriver';
import unconditionallyUpdateById from '../../unconditionallyUpdateById';

import define from '../define';

export default define({
	name: 'appointments.cancel',
	validate(
		consultationId: string,
		cancellationReason: string,
		cancellationExplanation: string,
	) {
		check(consultationId, String);
		check(cancellationReason, String);
		check(cancellationExplanation, String);
	},
	transaction: unconditionallyUpdateById<ConsultationDocument>(
		Appointments,
		async (
			db: TransactionDriver,
			existing,
			cancellationReason: string,
			cancellationExplanation: string,
		) => {
			check(cancellationReason, String);
			check(cancellationExplanation, String);
			const modifier: Mongo.Modifier<ConsultationDocument> = {
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
			return modifier;
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
