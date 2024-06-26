import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../_test/fixtures';

import {Patients} from '../../collection/patients';
import {Consultations} from '../../collection/consultations';

import {newPatient} from '../../_dev/populate/patients';
import {newConsultation} from '../../_dev/populate/consultations';
import {newAppointment} from '../../_dev/populate/appointments';

import invoke from '../invoke';

import patientsRemove from './remove';

server(__filename, () => {
	it('can delete own patient', async () => {
		const userId = randomUserId();

		const invocation = {userId};

		const patientId = await newPatient(invocation);

		await invoke(patientsRemove, invocation, [patientId]);

		assert.strictEqual(await Patients.find().countAsync(), 0);
	});

	it("cannot delete someone else's patient", async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const invocation = {userId: `${userId}x`};

		return throws(
			async () => invoke(patientsRemove, invocation, [patientId]),
			/not-found/,
		);
	});

	it('deletes associated consultations and appointments', async () => {
		const userId = randomUserId();

		const patientAId = await newPatient({userId});
		const patientBId = await newPatient({userId});

		await newConsultation({userId}, {patientId: patientAId});
		await newAppointment({userId}, {patient: {_id: patientAId}});
		await newConsultation(
			{userId},
			{patientId: patientBId, datetime: new Date()},
		);

		assert.strictEqual(await Patients.find().countAsync(), 2);
		assert.strictEqual(await Consultations.find().countAsync(), 3);

		await invoke(patientsRemove, {userId}, [patientAId]);

		assert.strictEqual(await Patients.find().countAsync(), 1);
		assert.strictEqual(await Consultations.find().countAsync(), 1);

		await invoke(patientsRemove, {userId}, [patientBId]);

		assert.strictEqual(await Patients.find().countAsync(), 0);
		assert.strictEqual(await Consultations.find().countAsync(), 0);
	});
});
