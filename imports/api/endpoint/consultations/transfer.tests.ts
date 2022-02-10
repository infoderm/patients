// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Random} from 'meteor/random';

import {server, throws} from '../../../test/fixtures';

import {Consultations} from '../../collection/consultations';

import {newPatient} from '../../_dev/populate/patients';
import {newConsultation} from '../../_dev/populate/consultations';

import invoke from '../invoke';
import consultationsTransfer from './transfer';

server(__filename, () => {
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

		await invoke(consultationsTransfer, {userId}, [consultationId, patientBId]);

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
			async () =>
				invoke(consultationsTransfer, {userId: `${userId}x`}, [
					consultationId,
					patientBId,
				]),
			/not-found/,
		);
	});
});
