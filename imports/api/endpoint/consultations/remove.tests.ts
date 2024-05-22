import {assert} from 'chai';

import {Patients} from '../../collection/patients';
import {randomUserId, server, throws} from '../../../_test/fixtures';
import {Consultations} from '../../collection/consultations';
import {newPatient} from '../../_dev/populate/patients';
import {newConsultation} from '../../_dev/populate/consultations';
import {newUpload} from '../../_dev/populate/uploads';

import {Uploads} from '../../uploads';

import invoke from '../invoke';

import consultationsAttach from './attach';
import consultationsRemove from './remove';

server(__filename, () => {
	it('can remove consultation', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const {insertedId: consultationId} = await newConsultation(
			{userId},
			{patientId},
		);

		assert.strictEqual(
			await Consultations.find({_id: consultationId}).countAsync(),
			1,
		);
		assert.strictEqual(await Consultations.find({patientId}).countAsync(), 1);

		await invoke(consultationsRemove, {userId}, [consultationId]);

		assert.strictEqual(await Consultations.find({patientId}).countAsync(), 0);
		assert.strictEqual(
			await Consultations.find({_id: consultationId}).countAsync(),
			0,
		);
	});

	it("cannot remove other user's consultation", async () => {
		const userId = randomUserId();

		const patientAId = await newPatient({userId});

		const {insertedId: consultationId} = await newConsultation(
			{userId},
			{patientId: patientAId},
		);

		return throws(
			async () =>
				invoke(consultationsRemove, {userId: `${userId}x`}, [consultationId]),
			/not-found/,
		);
	});

	it('cannot remove consultation when not logged in', async () => {
		const userId = randomUserId();

		const patientAId = await newPatient({userId});

		const {insertedId: consultationId} = await newConsultation(
			{userId},
			{patientId: patientAId},
		);

		return throws(
			async () =>
				invoke(consultationsRemove, {userId: undefined!}, [consultationId]),
			/not-authorized/,
		);
	});

	it("detaches removed consultation's attachments", async () => {
		const userId = randomUserId();

		assert.strictEqual(await Patients.find({}).countAsync(), 0);

		const patientId = await newPatient({userId});

		assert.strictEqual(await Patients.find({}).countAsync(), 1);

		assert.strictEqual(await Consultations.find({}).countAsync(), 0);

		const {insertedId: consultationId} = await newConsultation(
			{userId},
			{patientId},
		);

		assert.strictEqual(await Consultations.find({}).countAsync(), 1);

		assert.strictEqual(await Uploads.collection.find({}).countAsync(), 0);

		const uploadA = await newUpload({userId});
		const uploadB = await newUpload({userId});

		assert.strictEqual(await Uploads.collection.find({}).countAsync(), 2);
		assert.strictEqual(
			await Uploads.collection
				.find({
					'meta.attachedToConsultations': consultationId,
				})
				.countAsync(),
			0,
		);
		assert.strictEqual(
			await Uploads.collection
				.find({'meta.attachedToPatients': patientId})
				.countAsync(),
			0,
		);

		await invoke(consultationsAttach, {userId}, [consultationId, uploadA._id]);
		await invoke(consultationsAttach, {userId}, [consultationId, uploadB._id]);

		assert.strictEqual(await Patients.find({}).countAsync(), 1);
		assert.strictEqual(await Consultations.find({}).countAsync(), 1);
		assert.strictEqual(await Uploads.collection.find({}).countAsync(), 2);
		assert.strictEqual(
			await Uploads.collection
				.find({
					'meta.attachedToConsultations': consultationId,
				})
				.countAsync(),
			2,
		);
		assert.strictEqual(
			await Uploads.collection
				.find({'meta.attachedToPatients': patientId})
				.countAsync(),
			0,
		);

		await invoke(consultationsRemove, {userId}, [consultationId]);

		assert.strictEqual(await Uploads.collection.find({}).countAsync(), 2);
		assert.strictEqual(
			await Uploads.collection
				.find({
					'meta.attachedToConsultations': consultationId,
				})
				.countAsync(),
			0,
		);
		assert.strictEqual(
			await Uploads.collection
				.find({'meta.attachedToPatients': patientId})
				.countAsync(),
			0,
		);
		assert.strictEqual(await Consultations.find({}).countAsync(), 0);
		assert.strictEqual(await Patients.find({}).countAsync(), 1);
	});
});
