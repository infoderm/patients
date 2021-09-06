// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';

import totalOrder from 'total-order';
import {sorted} from '@iterable-iterator/sorted';

import invoke from './endpoint/invoke';
import patientsAttach from './endpoint/patients/attach';
import patientsMerge from './endpoint/patients/merge';
import {Patients, patients, PatientDocument} from './collection/patients.mock';
import {Consultations} from './collection/consultations.mock';
import {Documents} from './collection/documents.mock';
// eslint-disable-next-line import/no-unassigned-import
import './uploads.mock';
import {Attachments} from './collection/attachments.mock';

const setLike = (x) => sorted(totalOrder, x);

if (Meteor.isServer) {
	describe('Patients', () => {
		describe('methods', () => {
			beforeEach(() => {
				Patients.remove({});
				Consultations.remove({});
				Documents.remove({});
				Attachments.remove({});
			});

			it('can merge two patients', async () => {
				const userId = Random.id();
				const invocation = {userId};

				const patientA = Factory.create('patient', {
					owner: userId,
				}) as PatientDocument;
				const patientB = Factory.create('patient', {
					owner: userId,
				}) as PatientDocument;

				const uploadA = Factory.create('upload', {userId});
				const uploadB = Factory.create('upload', {userId});

				await invoke(patientsAttach, invocation, [patientA._id, uploadA._id]);

				await invoke(patientsAttach, invocation, [patientB._id, uploadB._id]);

				let consultationA = Factory.create('consultation', {
					owner: userId,
					patientId: patientA._id,
				});
				// create an irrelevant consultation
				Factory.create('consultation', {
					owner: userId,
				});

				let documentA = Factory.create('document', {
					owner: userId,
					patientId: patientA._id,
				});

				// create an irrelevant document
				Factory.create('document', {
					owner: userId,
				});

				assert.equal(Patients.find().count(), 4);

				const newPatientFields = patients.merge([patientA, patientB]);

				const oldPatientIds = [patientA._id, patientB._id];
				const consultationIds = [consultationA._id];
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

				assert.equal(Patients.find().count(), 3);
				assert.equal(Consultations.find().count(), 2);
				assert.equal(Attachments.find().count(), 2);
				assert.equal(Documents.find().count(), 2);

				const newPatient = Patients.findOne(newPatientId);

				assert.equal(newPatient.firstname, patientB.firstname);

				const expectedAttachments = setLike([uploadA, uploadB]);

				const newPatientAttachments = Attachments.find(
					{
						userId,
						'meta.attachedToPatients': newPatientId,
					},
					{fields: {meta: 0}},
				).fetch();

				assert.deepEqual(setLike(newPatientAttachments), expectedAttachments);

				consultationA = Consultations.findOne(consultationA._id);

				assert.equal(consultationA.patientId, newPatientId);

				documentA = Documents.findOne(documentA._id);

				assert.equal(documentA.patientId, newPatientId);
			});
		});
	});
}
