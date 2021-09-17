import {check} from 'meteor/check';

import {Patients} from '../../collection/patients';
import {PatientsSearchIndex} from '../../collection/patients/search';
import {Consultations} from '../../collection/consultations';
import {Documents} from '../../collection/documents';
import {Attachments} from '../../collection/attachments';

import define from '../define';
import {availability} from '../../availability';

export default define({
	name: '/api/patients/remove',
	validate(patientId: string) {
		check(patientId, String);
	},
	async run(patientId: string) {
		const owner = this.userId;
		const patient = Patients.findOne({_id: patientId, owner});
		if (!patient) {
			throw new Meteor.Error('not-found');
		}

		const consultationQuery = {owner: this.userId, patientId};
		const removedConsultations = Consultations.find(consultationQuery, {
			fields: {_id: 1, begin: 1, end: 1, isDone: 1, isCancelled: 1},
		}).fetch();
		const consultationIds = removedConsultations.map((x) => x._id);
		const nConsultationRemoved = Consultations.remove(consultationQuery);

		for (const {begin, end, isDone, isCancelled} of removedConsultations) {
			availability.removeHook(owner, begin, end, isDone || isCancelled ? 0 : 1);
		}

		if (consultationIds.length !== nConsultationRemoved) {
			console.warn(
				`Removed ${nConsultationRemoved} consultations while removing patient #${patientId} but ${
					consultationIds.length
				} where found before (${JSON.stringify(consultationIds)})`,
			);
		}

		Documents.update(
			{
				owner: this.userId,
				patientId,
			},
			{
				$set: {
					deleted: true,
				},
			},
			{
				multi: true,
			},
		);

		Attachments.update(
			{
				userId: this.userId,
				'meta.attachedToPatients': patientId,
			},
			{
				$pull: {'meta.attachedToPatients': patientId},
			},
			{
				multi: true,
			},
		);

		Attachments.update(
			{
				userId: this.userId,
				'meta.attachedToConsultations': {$in: consultationIds},
			},
			{
				$pullAll: {'meta.attachedToConsultations': consultationIds},
			},
			{
				multi: true,
			},
		);

		PatientsSearchIndex.remove(patientId);
		return Patients.remove(patientId);
	},
});
