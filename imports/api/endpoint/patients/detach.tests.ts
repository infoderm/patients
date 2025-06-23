import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../_test/fixtures';

import {Patients} from '../../collection/patients';
import {Attachments} from '../../collection/attachments';

import {newPatient} from '../../_dev/populate/patients';
import {newUpload} from '../../_dev/populate/uploads';

import invoke from '../invoke';

import patientsAttach from './attach';
import patientsDetach from './detach';

server(__filename, () => {
	it('can detach upload from patient', async () => {
		const userId = randomUserId();

		const patientAId = await newPatient({userId});
		const patientBId = await newPatient({userId});

		const {_id: uploadAId} = await newUpload({userId}, {type: 'image/png'});
		const {_id: uploadBId} = await newUpload(
			{userId},
			{type: 'application/pdf'},
		);

		await invoke(patientsAttach, {userId}, [patientAId, uploadAId]);
		await invoke(patientsAttach, {userId}, [patientBId, uploadBId]);

		await invoke(patientsDetach, {userId}, [patientAId, uploadAId]);

		assert.strictEqual(await Patients.find().countAsync(), 2);
		assert.strictEqual(await Attachments.find().countAsync(), 2);

		assert.strictEqual(
			await Attachments.findOneAsync({
				'meta.attachedToPatients': patientAId,
			}),
			undefined,
		);

		assert.deepInclude(
			await Attachments.findOneAsync({
				'meta.attachedToPatients': patientBId,
			}),
			{
				_id: uploadBId,
			},
		);

		await invoke(patientsDetach, {userId}, [patientBId, uploadBId]);

		assert.strictEqual(await Patients.find().countAsync(), 2);
		assert.strictEqual(await Attachments.find().countAsync(), 2);

		assert.strictEqual(
			await Attachments.findOneAsync({
				'meta.attachedToPatients': patientAId,
			}),
			undefined,
		);

		assert.strictEqual(
			await Attachments.findOneAsync({
				'meta.attachedToPatients': patientBId,
			}),
			undefined,
		);
	});

	it('is idempotent', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const {_id: uploadId} = await newUpload({userId});

		await invoke(patientsAttach, {userId}, [patientId, uploadId]);

		await invoke(patientsDetach, {userId}, [patientId, uploadId]);

		assert.strictEqual(
			await Attachments.findOneAsync({
				'meta.attachedToPatients': patientId,
			}),
			undefined,
		);

		await invoke(patientsDetach, {userId}, [patientId, uploadId]);

		assert.strictEqual(
			await Attachments.findOneAsync({
				'meta.attachedToPatients': patientId,
			}),
			undefined,
		);
	});

	it('cannot detach upload from a patient that is not owned', async () => {
		const userId = randomUserId();

		const patientXId = await newPatient({userId: `${userId}x`});

		const {_id: uploadId} = await newUpload({userId});

		return throws(
			async () => invoke(patientsDetach, {userId}, [patientXId, uploadId]),
			/not-found/,
		);
	});

	it('cannot detach non-owned upload from a patient', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const {_id: uploadXId} = await newUpload({userId: `${userId}x`});

		return throws(
			async () => invoke(patientsDetach, {userId}, [patientId, uploadXId]),
			/not-found/,
		);
	});

	it('cannot detach upload from a patient when both are not owned', async () => {
		const userId = randomUserId();

		const patientXId = await newPatient({userId: `${userId}x`});

		const {_id: uploadXId} = await newUpload({userId: `${userId}x`});

		return throws(
			async () => invoke(patientsDetach, {userId}, [patientXId, uploadXId]),
			/not-found/,
		);
	});

	it('cannot detach upload from a patient when not logged in', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const {_id: uploadId} = await newUpload({userId});

		return throws(
			async () =>
				invoke(patientsDetach, {userId: undefined!}, [patientId, uploadId]),
			/not-authorized/,
		);
	});
});
