import {check} from 'meteor/check';

import {ConsultationDocument} from '../../consultations';

import {Appointments} from '../../appointments';

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
	run: unconditionallyUpdateById<ConsultationDocument>(
		Appointments,
		(
			_existing,
			cancellationReason: string,
			cancellationExplanation: string,
		) => {
			check(cancellationReason, String);
			check(cancellationExplanation, String);
			return {
				$set: {
					isCancelled: true,
					cancellationDatetime: new Date(),
					cancellationReason,
					cancellationExplanation,
				},
			};
		},
	),
});
