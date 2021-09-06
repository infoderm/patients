// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert, expect} from 'chai';

import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';

import invoke from './endpoint/invoke';
import patientsRemove from './endpoint/patients/remove';

import {Patients} from './collection/patients.mock';
import {Consultations} from './collection/consultations.mock';

const throws = async (fn: () => Promise<any>, expected: string | RegExp) => {
	let thrownError: any;
	try {
		await fn();
	} catch (error: unknown) {
		thrownError = error;
	}

	if (typeof expected === 'string') {
		expect(thrownError.message).to.equal(expected);
	} else if (expected instanceof RegExp) {
		expect(thrownError.message).to.match(expected);
	}
};

if (Meteor.isServer) {
	describe('Patients', () => {
		describe('methods', () => {
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

			it("cannot delete someone else's patient", () => {
				const userId = Random.id();

				const patient = Factory.create('patient', {owner: userId});
				const patientId = patient._id;

				const invocation = {userId: `${userId}x`};

				throws(
					() => invoke(patientsRemove, invocation, [patientId]),
					/not-found/,
				);
			});
		});
	});
}
