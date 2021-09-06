import {check} from 'meteor/check';

import {Patients} from '../../collection/patients';
import {PatientsSearchIndex, patients} from '../../patients';
import {Consultations} from '../../collection/consultations';
import {Documents} from '../../collection/documents';
import {Attachments} from '../../collection/attachments';

// import executeTransaction from '../../transaction/executeTransaction';

import define from '../define';

const {sanitize, updateIndex} = patients;

export default define({
	name: '/patients/merge',
	validate(
		oldPatientIds,
		consultationIds,
		attachmentIds,
		documentIds,
		newPatient,
	) {
		check(oldPatientIds, Array);
		check(consultationIds, Array);
		check(attachmentIds, Array);
		check(documentIds, Array);
		check(newPatient, Object);
	},
	async run(
		oldPatientIds,
		consultationIds,
		attachmentIds,
		documentIds,
		newPatient,
	) {
		// Here is what is done in this method
		// (1) Check that user is connected
		// (2) Check that each patient in `oldPatientIds` is owned by the user
		// (3) Create new patient
		// (4) Attach consultations in `consultationIds` to newly created patient
		// (5) Remove consultations that have not been attached
		// (6) Attach attachments in `attachmentIds` to newly created patient
		// (7) Detach old patients from all attachments
		// (8) Attach documents in `documentIds` to newly created patient
		// (9) Remove documents that have not been attached
		// (10) Remove patients in `oldPatientIds`

		// (1)
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		// (2)
		for (const oldPatientId of oldPatientIds) {
			const oldPatient = Patients.findOne({
				_id: oldPatientId,
				owner: this.userId,
			});
			if (!oldPatient) {
				throw new Meteor.Error('not-found', 'no such patient');
			}
		}

		// (3)
		const fields = sanitize(newPatient);

		const newPatientId = Patients.insert({
			...fields,
			createdAt: new Date(),
			owner: this.userId,
		});

		updateIndex(this.userId, newPatientId, fields);

		// Not needed to update tags since the merged info should only contain
		// existing tags
		// updateTags(this.userId, fields);

		// (4)
		Consultations.update(
			{
				owner: this.userId, // This selector automatically filters out bad consultation ids
				patientId: {$in: oldPatientIds},
				_id: {$in: consultationIds},
			},
			{
				$set: {patientId: newPatientId},
			},
			{
				multi: true,
			},
		);

		// (5)
		Consultations.remove({
			owner: this.userId,
			patientId: {$in: oldPatientIds},
		});

		// (6)
		Attachments.update(
			{
				userId: this.userId, // This selector automatically filters out bad attachments ids
				'meta.attachedToPatients': {$in: oldPatientIds},
				_id: {$in: attachmentIds},
			},
			{
				$addToSet: {'meta.attachedToPatients': newPatientId},
			},
			{
				multi: true,
			},
		);

		// (7)
		Attachments.update(
			{
				userId: this.userId,
				'meta.attachedToPatients': {$in: oldPatientIds},
			},
			{
				$pullAll: {'meta.attachedToPatients': oldPatientIds},
			},
			{
				multi: true,
			},
		);

		// (8)
		Documents.update(
			{
				owner: this.userId, // This selector automatically filters out bad document ids
				patientId: {$in: oldPatientIds},
				_id: {$in: documentIds},
			},
			{
				$set: {patientId: newPatientId},
			},
			{
				multi: true,
			},
		);

		// (9)
		Documents.update(
			{
				owner: this.userId,
				patientId: {$in: oldPatientIds},
			},
			{
				$set: {deleted: true},
			},
			{
				multi: true,
			},
		);

		// (10)
		PatientsSearchIndex.remove({
			_id: {$in: oldPatientIds},
		});
		Patients.remove({
			_id: {$in: oldPatientIds},
		});

		return newPatientId;
	},
});
