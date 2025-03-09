import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../_test/fixtures';

import {Consultations} from '../../collection/consultations';

import {newPatient} from '../../_dev/populate/patients';
import {newConsultation} from '../../_dev/populate/consultations';

import invoke from '../invoke';

import consultationsTransfer from './transfer';

server(__filename, () => {
	it('can transfer consultation', async () => {
		const userId = randomUserId();

		const patientAId = await newPatient({userId});
		const patientBId = await newPatient({userId});

		const {insertedId: consultationId} = await newConsultation(
			{userId},
			{patientId: patientAId},
		);

		assert.strictEqual(
			await Consultations.find({patientId: patientAId}).countAsync(),
			1,
		);
		assert.strictEqual(
			await Consultations.find({patientId: patientBId}).countAsync(),
			0,
		);

		await invoke(consultationsTransfer, {userId}, [consultationId, patientBId]);

		assert.strictEqual(
			await Consultations.find({patientId: patientAId}).countAsync(),
			0,
		);
		assert.strictEqual(
			await Consultations.find({patientId: patientBId}).countAsync(),
			1,
		);
	});

	it("cannot transfer other user's consultation", async () => {
		const userId = randomUserId();

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
