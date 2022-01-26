// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Random} from 'meteor/random';

import invoke from '../invoke';

import {Patients} from '../../collection/patients';
import {server, throws} from '../../../test/fixtures';
import {Consultations} from '../../collection/consultations';
import {Uploads} from '../../uploads';
import {newPatient} from '../../_dev/populate/patients';
import {newConsultation} from '../../_dev/populate/consultations';
import {newUpload} from '../../_dev/populate/uploads';
import consultationsAttach from './attach';
import consultationsRemove from './remove';

server(__filename, () => {
	it('can remove consultation', async () => {
		const userId = Random.id();

		const patientId = await newPatient({userId});

		const {insertedId: consultationId} = await newConsultation(
			{userId},
			{patientId},
		);

		assert.equal(Consultations.find({_id: consultationId}).count(), 1);
		assert.equal(Consultations.find({patientId}).count(), 1);

		await invoke(consultationsRemove, {userId}, [consultationId]);

		assert.equal(Consultations.find({patientId}).count(), 0);
		assert.equal(Consultations.find({_id: consultationId}).count(), 0);
	});

	it("cannot remove other user's consultation", async () => {
		const userId = Random.id();

		const patientAId = await newPatient({userId});

		const {insertedId: consultationId} = await newConsultation(
			{userId},
			{patientId: patientAId},
		);

		return throws(
			() =>
				invoke(consultationsRemove, {userId: `${userId}x`}, [consultationId]),
			/not-found/,
		);
	});

	it("detaches removed consultation's attachments", async () => {
		const userId = Random.id();

		assert.equal(Patients.find({}).count(), 0);

		const patientId = await newPatient({userId});

		assert.equal(Patients.find({}).count(), 1);

		assert.equal(Consultations.find({}).count(), 0);

		const {insertedId: consultationId} = await newConsultation(
			{userId},
			{patientId},
		);

		assert.equal(Consultations.find({}).count(), 1);

		assert.equal(Uploads.find({}).count(), 0);

		const uploadA = await newUpload({userId});
		const uploadB = await newUpload({userId});

		assert.equal(Uploads.find({}).count(), 2);
		assert.equal(
			Uploads.find({
				'meta.attachedToConsultations': consultationId,
			}).count(),
			0,
		);
		assert.equal(
			Uploads.find({'meta.attachedToPatients': patientId}).count(),
			0,
		);

		await invoke(consultationsAttach, {userId}, [consultationId, uploadA._id]);
		await invoke(consultationsAttach, {userId}, [consultationId, uploadB._id]);

		assert.equal(Patients.find({}).count(), 1);
		assert.equal(Consultations.find({}).count(), 1);
		assert.equal(Uploads.find({}).count(), 2);
		assert.equal(
			Uploads.find({
				'meta.attachedToConsultations': consultationId,
			}).count(),
			2,
		);
		assert.equal(
			Uploads.find({'meta.attachedToPatients': patientId}).count(),
			0,
		);

		await invoke(consultationsRemove, {userId}, [consultationId]);

		assert.equal(Uploads.find({}).count(), 2);
		assert.equal(
			Uploads.find({
				'meta.attachedToConsultations': consultationId,
			}).count(),
			0,
		);
		assert.equal(
			Uploads.find({'meta.attachedToPatients': patientId}).count(),
			0,
		);
		assert.equal(Consultations.find({}).count(), 0);
		assert.equal(Patients.find({}).count(), 1);
	});
});
