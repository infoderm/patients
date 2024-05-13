import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../_test/fixtures';

import {Patients} from '../../collection/patients';
import {Attachments} from '../../collection/attachments';

import {newPatient} from '../../_dev/populate/patients';
import {newUpload} from '../../_dev/populate/uploads';

import invoke from '../invoke';

import patientsAttach from './attach';

server(__filename, () => {
	it('can attach uploads to patients', async () => {
		const userId = randomUserId();
		const invocation = {userId};

		const patientAId = await newPatient({userId});
		const patientBId = await newPatient({userId});
		await newPatient({userId});

		const {_id: uploadAId} = await newUpload({userId});
		const {_id: uploadBId} = await newUpload({userId});

		assert.equal(await Patients.find().countAsync(), 3);
		assert.equal(await Attachments.find().countAsync(), 2);

		await invoke(patientsAttach, invocation, [patientAId, uploadAId]);
		await invoke(patientsAttach, invocation, [patientBId, uploadBId]);

		assert.deepNestedInclude(await Attachments.findOneAsync(uploadAId), {
			'meta.attachedToPatients': [patientAId],
		});

		assert.deepNestedInclude(await Attachments.findOneAsync(uploadBId), {
			'meta.attachedToPatients': [patientBId],
		});
		assert.equal(await Patients.find().countAsync(), 3);
		assert.equal(await Attachments.find().countAsync(), 2);
	});

	it('is idempotent', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const {_id: uploadId} = await newUpload({userId});

		assert.equal(
			await Attachments.findOneAsync({
				'meta.attachedToPatients': patientId,
			}),
			undefined,
		);

		await invoke(patientsAttach, {userId}, [patientId, uploadId]);

		assert.deepInclude(
			await Attachments.findOneAsync({
				'meta.attachedToPatients': patientId,
			}),
			{
				_id: uploadId,
			},
		);

		await invoke(patientsAttach, {userId}, [patientId, uploadId]);

		assert.deepInclude(
			await Attachments.findOneAsync({
				'meta.attachedToPatients': patientId,
			}),
			{
				_id: uploadId,
			},
		);
	});

	it('cannot attach upload to a patient that is not owned', async () => {
		const userId = randomUserId();

		const patientXId = await newPatient({userId: `${userId}x`});

		const {_id: uploadId} = await newUpload({userId});

		return throws(
			async () => invoke(patientsAttach, {userId}, [patientXId, uploadId]),
			/not-found/,
		);
	});

	it('cannot attach non-owned upload to a patient', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const {_id: uploadXId} = await newUpload({userId: `${userId}x`});

		return throws(
			async () => invoke(patientsAttach, {userId}, [patientId, uploadXId]),
			/not-found/,
		);
	});

	it('cannot attach upload to a patient when both are not owned', async () => {
		const userId = randomUserId();

		const patientXId = await newPatient({userId: `${userId}x`});

		const {_id: uploadXId} = await newUpload({userId: `${userId}x`});

		return throws(
			async () => invoke(patientsAttach, {userId}, [patientXId, uploadXId]),
			/not-found/,
		);
	});

	it('cannot attach upload to a patient when not logged in', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const {_id: uploadId} = await newUpload({userId});

		return throws(
			async () =>
				invoke(patientsAttach, {userId: undefined!}, [patientId, uploadId]),
			/not-authorized/,
		);
	});
});
