// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';

import invoke from '../invoke';
import {Patients, patients, newPatient} from '../../collection/patients.mock';
import {
	Consultations,
	newConsultation,
} from '../../collection/consultations.mock';
import {Documents, newDocument} from '../../collection/documents.mock';
import {Attachments} from '../../collection/attachments.mock';
import {newUpload, Uploads} from '../../uploads.mock';
import {setLike} from '../../../test/fixtures';
import patientsMerge from './merge';
import patientsAttach from './attach';

if (Meteor.isServer) {
	describe('endpoint', () => {
		describe('patients', () => {
			describe('merge', () => {
				beforeEach(() => {
					Patients.remove({});
					Consultations.remove({});
					Documents.remove({});
					Uploads.remove({});
				});

				it('can merge two patients', async () => {
					const userId = Random.id();
					const invocation = {userId};

					const patientAId = await newPatient({userId});
					const patientBId = await newPatient({userId});
					const patientCId = await newPatient({userId});

					const uploadA = await newUpload({userId});
					const uploadB = await newUpload({userId});

					await invoke(patientsAttach, invocation, [patientAId, uploadA._id]);

					await invoke(patientsAttach, invocation, [patientBId, uploadB._id]);

					const {insertedId: consultationAId} = await newConsultation(
						invocation,
						{patientId: patientAId},
					);

					// create an irrelevant consultation
					await newConsultation(invocation, {patientId: patientCId});

					const documentAId = await newDocument(invocation, {
						patientId: patientAId,
					});

					let documentA = Documents.findOne(documentAId);

					// create an irrelevant document
					await newDocument(invocation);

					assert.equal(Patients.find().count(), 3);

					const patientA = Patients.findOne(patientAId);
					const patientB = Patients.findOne(patientBId);

					const newPatientFields = patients.merge([patientA, patientB]);

					const oldPatientIds = [patientAId, patientBId];
					const consultationIds = [consultationAId];
					const attachmentIds = [uploadA._id, uploadB._id];
					const documentIds = [documentA._id];

					const parameters = [
						oldPatientIds,
						consultationIds,
						attachmentIds,
						documentIds,
						newPatientFields,
					];

					const newPatientId = await invoke(
						patientsMerge,
						invocation,
						parameters,
					);

					assert.equal(Patients.find().count(), 2);
					assert.equal(Consultations.find().count(), 2);
					assert.equal(Attachments.find().count(), 2);
					assert.equal(Documents.find().count(), 2);

					const mergedPatient = Patients.findOne(newPatientId);

					assert.equal(mergedPatient.firstname, patientB.firstname);

					const expectedAttachments = setLike(
						[uploadA, uploadB].map(({meta, ...rest}) => rest),
					);

					const newPatientAttachments = Attachments.find(
						{
							userId,
							'meta.attachedToPatients': newPatientId,
						},
						{fields: {meta: 0, 'versions.original.meta': 0}},
					).fetch();

					assert.deepEqual(setLike(newPatientAttachments), expectedAttachments);

					const consultationA = Consultations.findOne(consultationAId);

					assert.equal(consultationA.patientId, newPatientId);

					documentA = Documents.findOne(documentA._id);

					assert.equal(documentA.patientId, newPatientId);
				});
			});
		});
	});
}
