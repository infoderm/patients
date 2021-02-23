// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';

import totalOrder from 'total-order';
import {sorted} from '@aureooms/js-itertools';

import {Patients, patients} from './patients.mock.js';
import {Consultations} from './consultations.mock.js';
import {Documents} from './documents.mock.js';
// eslint-disable-next-line import/no-unassigned-import
import './uploads.mock.js';
import {Attachments} from './attachments.mock.js';

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

			it('can merge two patients', () => {
				const userId = Random.id();
				const patientsMerge = Meteor.server.method_handlers['patients.merge'];
				const patientsAttach = Meteor.server.method_handlers['patients.attach'];
				const invocation = {userId};

				const patientA = Factory.create('patient', {owner: userId});
				const patientB = Factory.create('patient', {owner: userId});

				const uploadA = Factory.create('upload', {userId});
				const uploadB = Factory.create('upload', {userId});

				patientsAttach.apply(invocation, [patientA._id, uploadA._id]);
				patientsAttach.apply(invocation, [patientB._id, uploadB._id]);

				let consultationA = Factory.create('consultation', {
					owner: userId,
					patientId: patientA._id
				});
				// eslint-disable-next-line no-unused-vars
				const irrellevantConsultationA = Factory.create('consultation', {
					owner: userId
				});

				let documentA = Factory.create('document', {
					owner: userId,
					patientId: patientA._id
				});

				// eslint-disable-next-line no-unused-vars
				const irrellevantDocumentA = Factory.create('document', {
					owner: userId
				});

				assert.equal(Patients.find().count(), 4);

				let newPatient = patients.merge([patientA, patientB]);

				const oldPatientIds = [patientA._id, patientB._id];
				const consultationIds = [consultationA._id];
				const attachmentIds = [uploadA._id, uploadB._id];
				const documentIds = [documentA._id];

				const parameters = [
					oldPatientIds,
					consultationIds,
					attachmentIds,
					documentIds,
					newPatient
				];

				const newPatientId = patientsMerge.apply(invocation, parameters);

				assert.equal(Patients.find().count(), 3);
				assert.equal(Consultations.find().count(), 2);
				assert.equal(Attachments.find().count(), 2);
				assert.equal(Documents.find().count(), 2);

				newPatient = Patients.findOne(newPatientId);

				assert.equal(newPatient.firstname, patientB.firstname);

				const expectedAttachments = setLike([uploadA, uploadB]);

				const newPatientAttachments = Attachments.find(
					{
						userId,
						'meta.attachedToPatients': newPatientId
					},
					{fields: {meta: 0}}
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
