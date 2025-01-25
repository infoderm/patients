import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../_test/fixtures';

import {Patients} from '../../collection/patients';
import {Allergies} from '../../collection/allergies';
import {Doctors} from '../../collection/doctors';
import {Insurances} from '../../collection/insurances';

import {newPatient} from '../../_dev/populate/patients';
import {type FormattedLine, type NormalizedLine} from '../../string';
import {Changes} from '../../collection/changes';

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

		assert.strictEqual(await Patients.find({owner: userId}).countAsync(), 1);

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

	it('creates associated Changes entries', async () => {
		const userId = randomUserId();

		const patientId = await newPatient(
			{userId},
			{
				firstname: 'Alice',
				lastname: 'X',
				sex: 'female',
				about: 'about',
				municipality: 'municipality',
			},
		);

		const changes = await Changes.find({
			owner: userId,
			'operation.type': 'create',
		}).fetchAsync();

		assert.lengthOf(changes, 1);

		const {operation, what, who, when, why} = changes[0]!;

		assert.deepNestedInclude(operation, {
			type: 'create',
			'$set.owner': userId,
			'$set.firstname': 'Alice',
			'$set.lastname': 'X',
			'$set.sex': 'female',
			'$set.about': 'about',
			'$set.municipality': 'municipality',
		});

		assert.deepNestedInclude(what, {
			_id: patientId,
			type: 'patient',
		});

		assert.deepNestedInclude(who, {
			_id: userId,
			type: 'user',
		});

		assert.typeOf(when, 'Date');

		assert.deepNestedInclude(why, {
			method: 'insert',
			source: {
				type: 'manual',
			},
		});
	});
});
