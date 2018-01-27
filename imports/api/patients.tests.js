import { Meteor } from 'meteor/meteor';

import { Random } from 'meteor/random';

import { assert } from 'chai';

import { Patients } from './patients.js';

if (Meteor.isServer) {

	describe('Patients', () => {

		describe('methods', () => {

			const userId = Random.id();
			let patientId;

			beforeEach( () => {
				Patients.remove({});
				patientId = Patients.insert({
					niss: '00000',
					firstname: 'some',
					lastname: 'patient',
					birthdate: '1970-01-01',
					sex: 'other',
					createdAt: new Date(),
					owner: userId,
					username: 'tmeasday',
				});
			})

			it('can delete own patient', () => {

				const deletePatient = Meteor.server.method_handlers['patients.remove'];

				const invocation = { userId };

				deletePatient.apply(invocation, [patientId]);

				assert.equal(Patients.find().count(), 0);

			});

			it('cannot delete someone else\'s patient', () => {

				const deletePatient = Meteor.server.method_handlers['patients.remove'];

				const invocation = { userId: userId + 1 };

				assert.throws(() => deletePatient.apply(invocation, [patientId]), /not-authorized/);

			});

		});

	});

}
