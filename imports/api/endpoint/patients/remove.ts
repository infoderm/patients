import {check} from 'meteor/check';

import {Patients} from '../../collection/patients';
import {PatientsSearchIndex} from '../../patients';
import {Consultations} from '../../collection/consultations';
import {Documents} from '../../collection/documents';
import {Attachments} from '../../collection/attachments';

import define from '../define';

export default define({
	name: '/api/patients/remove',
	validate(patientId: string) {
		check(patientId, String);
	},
	async run(patientId: string) {
		const patient = Patients.findOne({_id: patientId, owner: this.userId});
		if (!patient) {
			throw new Meteor.Error('not-found');
		}

		const consultationQuery = {owner: this.userId, patientId};
		const consultationIds = Consultations.find(consultationQuery, {
			fields: {_id: 1},
		})
			.fetch()
			.map((x) => x._id);
		const nConsultationRemoved = Consultations.remove(consultationQuery);

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
