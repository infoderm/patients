import {check} from 'meteor/check';

import {thisYearsInterval} from '../../../util/datetime';

import {
	ConsultationDocument,
	findLastConsultationInInterval,
	filterNotInRareBooks,
} from '../../consultations';

import {Appointments} from '../../appointments';

import unconditionallyUpdateById from '../../unconditionallyUpdateById';

import define from '../define';

export default define({
	name: 'appointments.beginConsultation',
	validate(consultationId: string) {
		check(consultationId, String);
	},
	run: unconditionallyUpdateById<ConsultationDocument>(
		Appointments,
		function () {
			const book = findLastConsultationInInterval(thisYearsInterval(), {
				...filterNotInRareBooks(),
				owner: this.userId,
			})?.book;
			const realDatetime = new Date();
			return {
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
		},
	),
});
