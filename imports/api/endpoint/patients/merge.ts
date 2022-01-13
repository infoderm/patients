import {check} from 'meteor/check';

import {Patients} from '../../collection/patients';
import {PatientsSearchIndex} from '../../collection/patients/search';
import {Consultations} from '../../collection/consultations';
import {Documents} from '../../collection/documents';
import {Attachments} from '../../collection/attachments';

import {patients} from '../../patients';

import define from '../define';
import TransactionDriver from '../../transaction/TransactionDriver';

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
	async transaction(
		db: TransactionDriver,
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
			// eslint-disable-next-line no-await-in-loop
			const oldPatient = await db.findOne(Patients, {
				_id: oldPatientId,
				owner: this.userId,
			});
			if (oldPatient === null) {
				throw new Meteor.Error('not-found', 'no such patient');
			}
		}

		// (3)
		const fields = sanitize(newPatient);

		const {insertedId: newPatientId} = await db.insertOne(Patients, {
			...fields,
			createdAt: new Date(),
			owner: this.userId,
		});

		await updateIndex(db, this.userId, newPatientId, fields);

		// Not needed to update tags since the merged info should only contain
		// existing tags
		// await updateTags(db, this.userId, fields);

		// (4)
		await db.updateMany(
			Consultations,
			{
				owner: this.userId, // This selector automatically filters out bad consultation ids
				patientId: {$in: oldPatientIds},
				_id: {$in: consultationIds},
			},
			{
				$set: {patientId: newPatientId},
			},
		);

		// (5)
		await db.deleteMany(Consultations, {
			owner: this.userId,
			patientId: {$in: oldPatientIds},
		});

		// (6)
		await db.updateMany(
			Attachments,
			{
				userId: this.userId, // This selector automatically filters out bad attachments ids
				'meta.attachedToPatients': {$in: oldPatientIds},
				_id: {$in: attachmentIds},
			},
			{
				$addToSet: {'meta.attachedToPatients': newPatientId},
			},
		);

		// (7)
		await db.updateMany(
			Attachments,
			{
				userId: this.userId,
				'meta.attachedToPatients': {$in: oldPatientIds},
			},
			{
				$pullAll: {'meta.attachedToPatients': oldPatientIds},
			},
		);

		// (8)
		await db.updateMany(
			Documents,
			{
				owner: this.userId, // This selector automatically filters out bad document ids
				patientId: {$in: oldPatientIds},
				_id: {$in: documentIds},
			},
			{
				$set: {patientId: newPatientId},
			},
		);

		// (9)
		await db.updateMany(
			Documents,
			{
				owner: this.userId,
				patientId: {$in: oldPatientIds},
			},
			{
				$set: {deleted: true},
			},
		);

		// (10)
		await db.deleteMany(PatientsSearchIndex, {
			_id: {$in: oldPatientIds},
		});
		await db.deleteMany(Patients, {
			_id: {$in: oldPatientIds},
		});

		return newPatientId;
	},
});
