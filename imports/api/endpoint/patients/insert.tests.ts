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

		const allergies = ['a', 'b', 'c'];
		const doctors = ['d', 'e', 'f'];
		const insurances = ['g', 'h'];

		await newPatient({userId}, {allergies, doctors, insurances});

		assert.equal(Patients.find({owner: userId}).count(), 1);

		assert.sameMembers(
			Allergies.find()
				.fetch()
				.map(({name}) => name),
			allergies,
		);
		assert.sameMembers(
			Doctors.find()
				.fetch()
				.map(({name}) => name),
			doctors,
		);
		assert.sameMembers(
			Insurances.find()
				.fetch()
				.map(({name}) => name),
			insurances,
		);
	});
});
