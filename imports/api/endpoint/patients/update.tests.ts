// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';

import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../test/fixtures';

import {Patients} from '../../collection/patients';
import {Allergies} from '../../collection/allergies';
import {Doctors} from '../../collection/doctors';
import {Insurances} from '../../collection/insurances';

import {newPatient} from '../../_dev/populate/patients';
import invoke from '../invoke';
import update from './update';

server(__filename, () => {
	it('cannot update a patient when not logged in', async () => {
		const userId = randomUserId();
		const patientId = await newPatient({userId});
		return throws(
			async () => invoke(update, {userId: undefined}, [patientId, {}]),
			/not-authorized/,
		);
	});

	it("cannot update another user's patient", async () => {
		const userId = randomUserId();
		const patientId = await newPatient({userId});
		return throws(
			async () => invoke(update, {userId: `${userId}x`}, [patientId, {}]),
			/not-found/,
		);
	});

	it('cannot update a non-existing patient', async () => {
		const userId = randomUserId();
		await newPatient({userId});
		return throws(async () => invoke(update, {userId}, ['x', {}]), /not-found/);
	});

	it('creates associated tags', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});

		const allergies = ['a', 'b', 'c'].map((x) => ({displayName: x, name: x}));
		const doctors = ['d', 'e', 'f'].map((x) => ({displayName: x, name: x}));
		const insurances = ['g', 'h'].map((x) => ({displayName: x, name: x}));

		await invoke(update, {userId}, [
			patientId,
			{allergies, doctors, insurances},
		]);

		assert.equal(Patients.find({owner: userId}).count(), 1);

		assert.includeDeepMembers(
			Allergies.find()
				.fetch()
				.map(({displayName, name}) => ({displayName, name})),
			allergies,
		);
		assert.includeDeepMembers(
			Doctors.find()
				.fetch()
				.map(({displayName, name}) => ({displayName, name})),
			doctors,
		);
		assert.includeDeepMembers(
			Insurances.find()
				.fetch()
				.map(({displayName, name}) => ({displayName, name})),
			insurances,
		);
	});
});
