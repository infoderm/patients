import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../_test/fixtures';

import {Patients} from '../../collection/patients';
import {Allergies} from '../../collection/allergies';
import {Doctors} from '../../collection/doctors';
import {Insurances} from '../../collection/insurances';

import {newPatient} from '../../_dev/populate/patients';
import invoke from '../invoke';
import {type FormattedLine, type NormalizedLine} from '../../string';

import {Changes} from '../../collection/changes';

import update from './update';

server(__filename, () => {
	it('cannot update a patient when not logged in', async () => {
		const userId = randomUserId();
		const patientId = await newPatient({userId});
		return throws(
			async () => invoke(update, {userId: undefined!}, [patientId, {}]),
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

		await invoke(update, {userId}, [
			patientId,
			{allergies, doctors, insurances},
		]);

		assert.strictEqual(await Patients.find({owner: userId}).countAsync(), 1);

		assert.includeDeepMembers(
			await Allergies.find().mapAsync(({displayName, name}) => ({
				displayName,
				name,
			})),
			allergies,
		);
		assert.includeDeepMembers(
			await Doctors.find().mapAsync(({displayName, name}) => ({
				displayName,
				name,
			})),
			doctors,
		);
		assert.includeDeepMembers(
			await Insurances.find().mapAsync(({displayName, name}) => ({
				displayName,
				name,
			})),
			insurances,
		);
	});

	it('creates associated Changes entries', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId}, {firstname: 'Alice'});

		await invoke(update, {userId}, [patientId, {firstname: 'Bob'}]);

		const changes = await Changes.find({
			owner: userId,
			'operation.type': 'update',
		}).fetchAsync();

		assert.lengthOf(changes, 1);

		const {operation, what, who, when, why} = changes[0]!;

		assert.deepNestedInclude(operation, {
			'$set.firstname': 'Bob',
			$unset: {},
			type: 'update',
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
			method: 'update',
			source: {
				type: 'manual',
			},
		});
	});
});
