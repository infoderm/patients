import {assert} from 'chai';

import {randomUserId, server, setLike} from '../../../_test/fixtures';

import {Patients} from '../../collection/patients';
import {Consultations} from '../../collection/consultations';
import {Documents} from '../../collection/documents';
import {Attachments} from '../../collection/attachments';

import {newPatient} from '../../_dev/populate/patients';
import {newUpload} from '../../_dev/populate/uploads';
import {newConsultation} from '../../_dev/populate/consultations';
import {newDocument} from '../../_dev/populate/documents';

import {patients} from '../../patients';

import invoke from '../invoke';

import tuple from '../../../lib/types/tuple';

import patientsMerge from './merge';
import patientsAttach from './attach';

server(__filename, () => {
	it('can merge two patients', async () => {
		const userId = randomUserId();
		const invocation = {userId};

		const patientAId = await newPatient({userId});
		const patientBId = await newPatient({userId});
		const patientCId = await newPatient({userId});

		const uploadA = await newUpload({userId});
		const uploadB = await newUpload({userId});

		await invoke(patientsAttach, invocation, [patientAId, uploadA._id]);

		await invoke(patientsAttach, invocation, [patientBId, uploadB._id]);

		const {insertedId: consultationAId} = await newConsultation(invocation, {
			patientId: patientAId,
		});

		// create an irrelevant consultation
		await newConsultation(invocation, {
			patientId: patientCId,
			datetime: new Date(),
		});

		const documentAId = await newDocument(invocation, {
			patientId: patientAId,
		});

		let documentA = await Documents.findOneAsync(documentAId);

		// create an irrelevant document
		await newDocument(invocation);

		assert.equal(await Patients.find().countAsync(), 3);

		const patientA = await Patients.findOneAsync(patientAId);
		const patientB = await Patients.findOneAsync(patientBId);

		const newPatientFields = patients.merge([patientA!, patientB!]);

		const oldPatientIds = [patientAId, patientBId];
		const consultationIds = [consultationAId];
		const attachmentIds = [uploadA._id, uploadB._id];
		const documentIds = [documentA!._id];

		const parameters = tuple(
			oldPatientIds,
			consultationIds,
			attachmentIds,
			documentIds,
			newPatientFields,
		);

		const newPatientId = await invoke(patientsMerge, invocation, parameters);

		assert.equal(await Patients.find().countAsync(), 2);
		assert.equal(await Consultations.find().countAsync(), 2);
		assert.equal(await Attachments.find().countAsync(), 2);
		assert.equal(await Documents.find().countAsync(), 2);

		const mergedPatient = await Patients.findOneAsync(newPatientId);

		assert.equal(mergedPatient!.firstname, patientB!.firstname);

		const expectedAttachments = setLike(
			[uploadA, uploadB].map(({meta, ...rest}) => rest),
		);

		const newPatientAttachments = await Attachments.find(
			{
				userId,
				'meta.attachedToPatients': newPatientId,
			},
			{fields: {meta: 0, 'versions.original.meta': 0}},
		).fetchAsync();

		assert.deepEqual(setLike(newPatientAttachments), expectedAttachments);

		const consultationA = await Consultations.findOneAsync(consultationAId);

		assert.equal(consultationA!.patientId, newPatientId);

		documentA = await Documents.findOneAsync(documentA!._id);

		assert.equal(documentA!.patientId, newPatientId);
	});
});
