import "regenerator-runtime/runtime.js";
import { assert } from 'chai';

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import { Patients , patients } from './patients.mock.js';
import { Consultations } from './consultations.mock.js';
import { Documents } from './documents.mock.js';
import { Uploads } from './uploads.mock.js';

if (Meteor.isServer) {

	describe('Patients', () => {

		describe('methods', () => {

			beforeEach( () => {
				Patients.remove({});
				Consultations.remove({});
				Documents.remove({});
				Uploads.collection.remove({});
			})

			it('can merge two patients', () => {
				const userId = Random.id();
				const patientsMerge = Meteor.server.method_handlers['patients.merge'];
				const patientsAttach = Meteor.server.method_handlers['patients.attach'];
				const invocation = { userId };

				let patientA = Factory.create('patient', {owner: userId}) ;
				let patientB = Factory.create('patient', {owner: userId}) ;

				const uploadA = Factory.create('upload', { userId });
				const uploadB = Factory.create('upload', { userId });

				patientsAttach.apply(invocation, [patientA._id, uploadA._id]) ;
				patientsAttach.apply(invocation, [patientB._id, uploadB._id]) ;

				patientA = Patients.findOne(patientA._id);
				patientB = Patients.findOne(patientB._id);

				let consultationA = Factory.create('consultation', {
					owner: userId ,
					patientId: patientA._id ,
				});

				const irrellevantConsultationA = Factory.create('consultation', {
					owner: userId ,
				});

				let documentA = Factory.create('document', {
					owner: userId ,
					patientId: patientA._id ,
				});

				const irrellevantDocumentA = Factory.create('document', {
					owner: userId ,
				});

				assert.equal(Patients.find().count(), 4);

				let newPatient = patients.merge([patientA, patientB]);

				const oldPatientIds = [ patientA._id , patientB._id ] ;
				const consultationIds = [ consultationA._id ] ;
				const documentIds = [ documentA._id ] ;

				const params = [oldPatientIds, consultationIds, documentIds, newPatient] ;

				const newPatientId = patientsMerge.apply(invocation, params);

				assert.equal(Patients.find().count(), 3);
				assert.equal(Consultations.find().count(), 2);
				assert.equal(Documents.find().count(), 2);

				newPatient = Patients.findOne(newPatientId) ;

				assert.equal(newPatient.firstname,patientB.firstname) ;

				const expectedAttachments = new Set([ ...patientB.attachments ,  ...patientA.attachments ]) ;

				assert.deepEqual(new Set(newPatient.attachments), expectedAttachments) ;

				consultationA = Consultations.findOne(consultationA._id) ;

				assert.equal(consultationA.patientId, newPatientId) ;

				documentA = Documents.findOne(documentA._id) ;

				assert.equal(documentA.patientId, newPatientId) ;

			});

		});

	});

}
