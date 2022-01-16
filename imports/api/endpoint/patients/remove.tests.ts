// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import {Random} from 'meteor/random';

import invoke from '../invoke';

import {Patients, newPatient} from '../../collection/patients.mock';
import {server, throws} from '../../../test/fixtures';
import {
	Consultations,
	newConsultation,
} from '../../collection/consultations.mock';
import {newAppointment} from '../../collection/appointments.mock';
import patientsRemove from './remove';

server(__filename, () => {
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

	it('deletes associated consultations and appointments', async () => {
		const userId = Random.id();

		const patientAId = await newPatient({userId});
		const patientBId = await newPatient({userId});

		await newConsultation({userId}, {patientId: patientAId});
		await newAppointment({userId}, {patient: {_id: patientAId}});
		await newConsultation({userId}, {patientId: patientBId});

		assert.equal(Patients.find().count(), 2);
		assert.equal(Consultations.find().count(), 3);

		await invoke(patientsRemove, {userId}, [patientAId]);

		assert.equal(Patients.find().count(), 1);
		assert.equal(Consultations.find().count(), 1);

		await invoke(patientsRemove, {userId}, [patientBId]);

		assert.equal(Patients.find().count(), 0);
		assert.equal(Consultations.find().count(), 0);
	});
});
