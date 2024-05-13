import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../_test/fixtures';

import {Patients} from '../../collection/patients';
import {Allergies} from '../../collection/allergies';
import {Doctors} from '../../collection/doctors';
import {Insurances} from '../../collection/insurances';

import {newPatient} from '../../_dev/populate/patients';
import {type FormattedLine, type NormalizedLine} from '../../string';

server(__filename, () => {
	it('cannot create a patient when not logged in', async () => {
		return throws(
			async () => newPatient({userId: undefined}),
			/not-authorized/,
		);
	});

	it('creates associated tags', async () => {
		const userId = randomUserId();

		const allergies = ['a', 'b', 'c'].map((x) => ({
			displayName: x as FormattedLine,
			name: x as NormalizedLine,
		}));
		const doctors = ['d', 'e', 'f'].map((x) => ({
			displayName: x as FormattedLine,
			name: x as NormalizedLine,
		}));
		const insurances = ['g', 'h'].map((x) => ({
			displayName: x as FormattedLine,
			name: x as NormalizedLine,
		}));

		await newPatient({userId}, {allergies, doctors, insurances});

		assert.equal(await Patients.find({owner: userId}).countAsync(), 1);

		assert.sameDeepMembers(
			await Allergies.find().mapAsync(({displayName, name}) => ({
				displayName,
				name,
			})),
			allergies,
		);
		assert.sameDeepMembers(
			await Doctors.find().mapAsync(({displayName, name}) => ({
				displayName,
				name,
			})),
			doctors,
		);
		assert.sameDeepMembers(
			await Insurances.find().mapAsync(({displayName, name}) => ({
				displayName,
				name,
			})),
			insurances,
		);
	});
});
