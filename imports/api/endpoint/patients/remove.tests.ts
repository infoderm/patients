// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';

import invoke from '../invoke';

import {Patients, newPatient} from '../../collection/patients.mock';
import {throws} from '../../../test/fixtures';
import patientsRemove from './remove';

if (Meteor.isServer) {
	describe('endpoint', () => {
		describe('patients', () => {
			describe('remove', () => {
				beforeEach(() => {
					Patients.remove({});
				});

				it('can delete own patient', async () => {
					const userId = Random.id();

					const invocation = {userId};

					const patientId = await newPatient(invocation);

					await invoke(patientsRemove, invocation, [patientId]);

					assert.equal(Patients.find().count(), 0);
				});

				it("cannot delete someone else's patient", async () => {
					const userId = Random.id();

					const patientId = await newPatient({userId});

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
