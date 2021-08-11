// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';

import {Patients} from './patients.mock';
import {Consultations} from './consultations.mock';

if (Meteor.isServer) {
	const methods = (
		Meteor as unknown as {server: {method_handlers: Record<string, Function>}}
	).server.method_handlers;

	describe('Patients', () => {
		describe('methods', () => {
			beforeEach(() => {
				Patients.remove({});
				Consultations.remove({});
			});

			it('can delete own patient', () => {
				const userId = Random.id();

				const patient = Factory.create('patient', {owner: userId});
				const patientId = patient._id;

				const patientsRemove = methods['patients.remove'];

				const invocation = {userId};

				patientsRemove.apply(invocation, [patientId]);

				assert.equal(Patients.find().count(), 0);
			});

			it("cannot delete someone else's patient", () => {
				const userId = Random.id();

				const patient = Factory.create('patient', {owner: userId});
				const patientId = patient._id;

				const patientsRemove = methods['patients.remove'];

				const invocation = {userId: `${userId}x`};

				assert.throws(
					() => patientsRemove.apply(invocation, [patientId]),
					/not-found/,
				);
			});
		});
	});
}
