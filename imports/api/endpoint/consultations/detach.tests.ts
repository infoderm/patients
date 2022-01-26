// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../test/fixtures';

import {Patients} from '../../collection/patients';
import {Consultations} from '../../collection/consultations';
import {Attachments} from '../../collection/attachments';

import {newPatient} from '../../_dev/populate/patients';
import {newConsultation} from '../../_dev/populate/consultations';
import {newUpload} from '../../_dev/populate/uploads';

import invoke from '../invoke';
import consultationsAttach from './attach';
import consultationsDetach from './detach';

server(__filename, () => {
	it('can detach upload from consultation', async () => {
		const userId = randomUserId();

		const patientAId = await newPatient({userId});
		const patientBId = await newPatient({userId});

		const {insertedId: consultationAId} = await newConsultation(
			{userId},
			{patientId: patientAId},
		);

		const {insertedId: consultationBId} = await newConsultation(
			{userId},
			{patientId: patientBId},
		);

		const {_id: uploadAId} = await newUpload({userId});
		const {_id: uploadBId} = await newUpload({userId});

		await invoke(consultationsAttach, {userId}, [consultationAId, uploadAId]);
		await invoke(consultationsAttach, {userId}, [consultationBId, uploadBId]);

		await invoke(consultationsDetach, {userId}, [consultationAId, uploadAId]);

		assert.equal(Patients.find().count(), 2);
		assert.equal(Consultations.find({patientId: patientAId}).count(), 1);
		assert.equal(Consultations.find({patientId: patientBId}).count(), 1);
		assert.equal(Attachments.find().count(), 2);

		assert.equal(
			Attachments.findOne({
				'meta.attachedToConsultations': consultationAId,
			}),
			undefined,
		);

		assert.deepInclude(
			Attachments.findOne({
				'meta.attachedToConsultations': consultationBId,
			}),
			{
				_id: uploadBId,
			},
		);

		await invoke(consultationsDetach, {userId}, [consultationBId, uploadBId]);

		assert.equal(Patients.find().count(), 2);
		assert.equal(Consultations.find({patientId: patientAId}).count(), 1);
		assert.equal(Consultations.find({patientId: patientBId}).count(), 1);
		assert.equal(Attachments.find().count(), 2);

		assert.equal(
			Attachments.findOne({
				'meta.attachedToConsultations': consultationAId,
			}),
			undefined,
		);

		assert.equal(
			Attachments.findOne({
				'meta.attachedToConsultations': consultationBId,
			}),
			undefined,
		);
	});

	it('detach is idempotent', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const {insertedId: consultationId} = await newConsultation(
			{userId},
			{patientId},
		);

		const {_id: uploadId} = await newUpload({userId});

		await invoke(consultationsAttach, {userId}, [consultationId, uploadId]);

		await invoke(consultationsDetach, {userId}, [consultationId, uploadId]);

		assert.equal(
			Attachments.findOne({
				'meta.attachedToConsultations': consultationId,
			}),
			undefined,
		);

		await invoke(consultationsDetach, {userId}, [consultationId, uploadId]);

		assert.equal(
			Attachments.findOne({
				'meta.attachedToConsultations': consultationId,
			}),
			undefined,
		);
	});

	it('cannot detach upload from a consultation that is not owned', async () => {
		const userId = randomUserId();

		const patientXId = await newPatient({userId: `${userId}x`});

		const {insertedId: consultationXId} = await newConsultation(
			{userId: `${userId}x`},
			{patientId: patientXId},
		);

		const {_id: uploadId} = await newUpload({userId});

		return throws(
			async () =>
				invoke(consultationsDetach, {userId}, [consultationXId, uploadId]),
			/not-found/,
		);
	});

	it('cannot detach non-owned upload from a consultation', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const {insertedId: consultationId} = await newConsultation(
			{userId},
			{patientId},
		);

		const {_id: uploadXId} = await newUpload({userId: `${userId}x`});

		return throws(
			async () =>
				invoke(consultationsDetach, {userId}, [consultationId, uploadXId]),
			/not-found/,
		);
	});

	it('cannot detach upload from a consultation when both are not owned', async () => {
		const userId = randomUserId();

		const patientXId = await newPatient({userId: `${userId}x`});

		const {insertedId: consultationXId} = await newConsultation(
			{userId: `${userId}x`},
			{patientId: patientXId},
		);

		const {_id: uploadXId} = await newUpload({userId: `${userId}x`});

		return throws(
			async () =>
				invoke(consultationsDetach, {userId}, [consultationXId, uploadXId]),
			/not-found/,
		);
	});

	it('cannot detach upload from a consultation when not logged in', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const {insertedId: consultationId} = await newConsultation(
			{userId},
			{patientId},
		);

		const {_id: uploadId} = await newUpload({userId});

		return throws(
			async () =>
				invoke(consultationsDetach, {userId: undefined}, [
					consultationId,
					uploadId,
				]),
			/not-authorized/,
		);
	});
});
