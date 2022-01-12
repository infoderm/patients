// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';

import invoke from '../invoke';

import {Patients, newPatient} from '../../collection/patients.mock';
import {throws} from '../../../test/fixtures';
import {
	Consultations,
	newConsultation,
} from '../../collection/consultations.mock';
import consultationsTransfer from './transfer';

if (Meteor.isServer) {
	describe('endpoint', () => {
		describe('consultations', () => {
			describe('transfer', () => {
				beforeEach(() => {
					Patients.remove({});
					Consultations.remove({});
				});

				it('can transfer consultation', async () => {
					const userId = Random.id();

					const patientAId = await newPatient({userId});
					const patientBId = await newPatient({userId});

					const {insertedId: consultationId} = await newConsultation(
						{userId},
						{patientId: patientAId},
					);

					assert.equal(Consultations.find({patientId: patientAId}).count(), 1);
					assert.equal(Consultations.find({patientId: patientBId}).count(), 0);

					await invoke(consultationsTransfer, {userId}, [
						consultationId,
						patientBId,
					]);

					assert.equal(Consultations.find({patientId: patientAId}).count(), 0);
					assert.equal(Consultations.find({patientId: patientBId}).count(), 1);
				});

				it("cannot transfer other user's consultation", async () => {
					const userId = Random.id();

					const patientAId = await newPatient({userId});
					const patientBId = await newPatient({userId});

					const {insertedId: consultationId} = await newConsultation(
						{userId},
						{patientId: patientAId},
					);

					return throws(
						() =>
							invoke(consultationsTransfer, {userId: `${userId}x`}, [
								consultationId,
								patientBId,
							]),
						/not-found/,
					);
				});
			});
		});
	});
}
