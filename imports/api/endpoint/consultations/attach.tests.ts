import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../_test/fixtures';

import {Patients} from '../../collection/patients';
import {Consultations} from '../../collection/consultations';
import {Attachments} from '../../collection/attachments';

import {newPatient} from '../../_dev/populate/patients';
import {newConsultation} from '../../_dev/populate/consultations';
import {newUpload} from '../../_dev/populate/uploads';

import invoke from '../invoke';

import consultationsAttach from './attach';

server(__filename, () => {
	it('can attach upload to consultation', async () => {
		const userId = randomUserId();

		const patientAId = await newPatient({userId});
		const patientBId = await newPatient({userId});

		const {insertedId: consultationAId} = await newConsultation(
			{userId},
			{patientId: patientAId},
		);

		const {insertedId: consultationBId} = await newConsultation(
			{userId},
			{patientId: patientBId, datetime: new Date()},
		);

		const {_id: uploadAId} = await newUpload({userId});
		const {_id: uploadBId} = await newUpload({userId});

		assert.equal(await Patients.find().countAsync(), 2);
		assert.equal(
			await Consultations.find({patientId: patientAId}).countAsync(),
			1,
		);
		assert.equal(
			await Consultations.find({patientId: patientBId}).countAsync(),
			1,
		);
		assert.equal(await Attachments.find().countAsync(), 2);

		await invoke(consultationsAttach, {userId}, [consultationAId, uploadAId]);

		assert.equal(await Patients.find().countAsync(), 2);
		assert.equal(
			await Consultations.find({patientId: patientAId}).countAsync(),
			1,
		);
		assert.equal(
			await Consultations.find({patientId: patientBId}).countAsync(),
			1,
		);
		assert.equal(await Attachments.find().countAsync(), 2);

		assert.deepInclude(
			await Attachments.findOneAsync({
				'meta.attachedToConsultations': consultationAId,
			}),
			{
				_id: uploadAId,
			},
		);

		assert.equal(
			await Attachments.findOneAsync({
				'meta.attachedToConsultations': consultationBId,
			}),
			undefined,
		);

		await invoke(consultationsAttach, {userId}, [consultationBId, uploadBId]);

		assert.equal(await Patients.find().countAsync(), 2);
		assert.equal(
			await Consultations.find({patientId: patientAId}).countAsync(),
			1,
		);
		assert.equal(
			await Consultations.find({patientId: patientBId}).countAsync(),
			1,
		);
		assert.equal(await Attachments.find().countAsync(), 2);

		assert.deepInclude(
			await Attachments.findOneAsync({
				'meta.attachedToConsultations': consultationAId,
			}),
			{
				_id: uploadAId,
			},
		);

		assert.deepInclude(
			await Attachments.findOneAsync({
				'meta.attachedToConsultations': consultationBId,
			}),
			{
				_id: uploadBId,
			},
		);
	});

	it('attach is idempotent', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const {insertedId: consultationId} = await newConsultation(
			{userId},
			{patientId},
		);

		const {_id: uploadId} = await newUpload({userId});

		assert.equal(
			await Attachments.findOneAsync({
				'meta.attachedToConsultations': consultationId,
			}),
			undefined,
		);

		await invoke(consultationsAttach, {userId}, [consultationId, uploadId]);

		assert.deepInclude(
			await Attachments.findOneAsync({
				'meta.attachedToConsultations': consultationId,
			}),
			{
				_id: uploadId,
			},
		);

		await invoke(consultationsAttach, {userId}, [consultationId, uploadId]);

		assert.deepInclude(
			await Attachments.findOneAsync({
				'meta.attachedToConsultations': consultationId,
			}),
			{
				_id: uploadId,
			},
		);
	});

	it('cannot attach upload to a consultation that is not owned', async () => {
		const userId = randomUserId();

		const patientXId = await newPatient({userId: `${userId}x`});

		const {insertedId: consultationXId} = await newConsultation(
			{userId: `${userId}x`},
			{patientId: patientXId},
		);

		const {_id: uploadId} = await newUpload({userId});

		return throws(
			async () =>
				invoke(consultationsAttach, {userId}, [consultationXId, uploadId]),
			/not-found/,
		);
	});

	it('cannot attach non-owned upload to a consultation', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const {insertedId: consultationId} = await newConsultation(
			{userId},
			{patientId},
		);

		const {_id: uploadXId} = await newUpload({userId: `${userId}x`});

		return throws(
			async () =>
				invoke(consultationsAttach, {userId}, [consultationId, uploadXId]),
			/not-found/,
		);
	});

	it('cannot attach upload to a consultation when both are not owned', async () => {
		const userId = randomUserId();

		const patientXId = await newPatient({userId: `${userId}x`});

		const {insertedId: consultationXId} = await newConsultation(
			{userId: `${userId}x`},
			{patientId: patientXId},
		);

		const {_id: uploadXId} = await newUpload({userId: `${userId}x`});

		return throws(
			async () =>
				invoke(consultationsAttach, {userId}, [consultationXId, uploadXId]),
			/not-found/,
		);
	});

	it('cannot attach upload to a consultation when not logged in', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const {insertedId: consultationId} = await newConsultation(
			{userId},
			{patientId},
		);

		const {_id: uploadId} = await newUpload({userId});

		return throws(
			async () =>
				invoke(consultationsAttach, {userId: undefined!}, [
					consultationId,
					uploadId,
				]),
			/not-authorized/,
		);
	});
});
