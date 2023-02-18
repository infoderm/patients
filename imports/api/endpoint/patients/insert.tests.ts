// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';

import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../test/fixtures';

import {Patients} from '../../collection/patients';
import {Allergies} from '../../collection/allergies';
import {Doctors} from '../../collection/doctors';
import {Insurances} from '../../collection/insurances';

import {newPatient} from '../../_dev/populate/patients';

server(__filename, () => {
	it('cannot create a patient when not logged in', async () => {
		return throws(
			async () => newPatient({userId: undefined}),
			/not-authorized/,
		);
	});

	it('creates associated tags', async () => {
		const userId = randomUserId();

		const allergies = ['a', 'b', 'c'].map((x) => ({displayName: x, name: x}));
		const doctors = ['d', 'e', 'f'].map((x) => ({displayName: x, name: x}));
		const insurances = ['g', 'h'].map((x) => ({displayName: x, name: x}));

		await newPatient({userId}, {allergies, doctors, insurances});

		assert.equal(await Patients.find({owner: userId}).countAsync(), 1);

		assert.sameDeepMembers(
			Allergies.find()
				.fetch()
				.map(({displayName, name}) => ({displayName, name})),
			allergies,
		);
		assert.sameDeepMembers(
			Doctors.find()
				.fetch()
				.map(({displayName, name}) => ({displayName, name})),
			doctors,
		);
		assert.sameDeepMembers(
			Insurances.find()
				.fetch()
				.map(({displayName, name}) => ({displayName, name})),
			insurances,
		);
	});
});
