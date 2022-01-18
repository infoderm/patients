// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';

import invoke from '../invoke';

import {Patients} from '../../collection/patients.mock';
import {Consultations} from '../../collection/consultations.mock';
import {throws} from '../../../test/fixtures';
import patientsRemove from './remove';

if (Meteor.isServer) {
	describe('endpoint', () => {
		describe('patients', () => {
			describe('remove', () => {
				beforeEach(() => {
					Patients.remove({});
					Consultations.remove({});
				});

				it('can delete own patient', async () => {
					const userId = Random.id();

					const patient = Factory.create('patient', {owner: userId});
					const patientId = patient._id;

					const invocation = {userId};

					await invoke(patientsRemove, invocation, [patientId]);

					assert.equal(Patients.find().count(), 0);
				});

				it("cannot delete someone else's patient", async () => {
					const userId = Random.id();

					const patient = Factory.create('patient', {owner: userId});
					const patientId = patient._id;

					const invocation = {userId: `${userId}x`};

					return throws(
						() => invoke(patientsRemove, invocation, [patientId]),
						/not-found/,
					);
				});
			});
		});
	});
}
