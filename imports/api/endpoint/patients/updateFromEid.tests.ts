import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../_test/fixtures';

import {Patients} from '../../collection/patients';
import {Allergies} from '../../collection/allergies';
import {Doctors} from '../../collection/doctors';
import {Insurances} from '../../collection/insurances';

import {newPatient} from '../../_dev/populate/patients';
import invoke from '../invoke';

import {newEidData} from '../../_dev/populate/eids';
import {normalizedName, patientFieldsFromEid} from '../../patients';

import {Eids} from '../../collection/eids';
import removeUndefined from '../../../util/object/removeUndefined';

import {Changes} from '../../collection/changes';

import updateFromEid from './updateFromEid';

server(__filename, () => {
	it('cannot update a patient when not logged in', async () => {
		const userId = randomUserId();
		const patientId = await newPatient({userId});
		const eidInfo = newEidData();
		return throws(
			async () =>
				invoke(
					updateFromEid,
					// @ts-expect-error Type-checking is working as expected.
					{userId: undefined},
					[patientId, eidInfo],
				),
			/not-authorized/,
		);
	});

	it("cannot update another user's patient", async () => {
		const userId = randomUserId();
		const patientId = await newPatient({userId});
		const eidInfo = newEidData();
		return throws(
			async () =>
				invoke(updateFromEid, {userId: `${userId}x`}, [patientId, eidInfo]),
			/not-found/,
		);
	});

	it('cannot update a non-existing patient', async () => {
		const userId = randomUserId();
		const patientId = await newPatient({userId});
		const eidInfo = newEidData();
		return throws(
			async () => invoke(updateFromEid, {userId}, [`${patientId}x`, eidInfo]),
			/not-found/,
		);
	});

	it('can update a patient when logged in', async () => {
		const userId = randomUserId();

		const eid = newEidData();

		const patientId = await newPatient({userId});

		const patientsBefore = await Patients.find({owner: userId}).fetchAsync();

		assert.strictEqual(patientsBefore.length, 1);

		const {
			photo,
			sex,
			about,
			antecedents,
			noshow,
			allergies,
			insurances,
			doctors,
			ongoing,
			phone,
		} = patientsBefore[0]!;

		await invoke(updateFromEid, {userId}, [patientId, eid]);

		const patients = await Patients.find({owner: userId}).fetchAsync();

		assert.strictEqual(patients.length, 1);

		const expectedPreviousFieldsIfAbsentInEid = {
			sex,
			photo,
		};

		const expectedChangedFields = patientFieldsFromEid(eid);
		const expectedComputedFields = {
			normalizedName: normalizedName(
				expectedChangedFields.firstname,
				expectedChangedFields.lastname,
			),
		};

		const expectedUnchangedFields = {
			about,
			antecedents,
			allergies,
			insurances,
			doctors,
			noshow,
			ongoing,
			phone,
		};

		const expected = removeUndefined({
			...expectedPreviousFieldsIfAbsentInEid,
			...expectedChangedFields,
			...expectedComputedFields,
			...expectedUnchangedFields,
		});
		const {_id, createdAt, owner, ...actual} = patients[0]!;

		assert.strictEqual(patientId, _id);

		assert.strictEqual(owner, userId);

		assert.deepEqual(actual, expected);

		assert.isAtMost(createdAt.valueOf(), Date.now());

		assert.includeDeepMembers(
			await Allergies.find().mapAsync(({displayName, name}) => ({
				displayName,
				name,
			})),
			allergies!.map(({displayName, name}) => ({displayName, name})),
		);
		assert.includeDeepMembers(
			await Doctors.find().mapAsync(({displayName, name}) => ({
				displayName,
				name,
			})),
			doctors!.map(({displayName, name}) => ({displayName, name})),
		);
		assert.includeDeepMembers(
			await Insurances.find().mapAsync(({displayName, name}) => ({
				displayName,
				name,
			})),
			insurances!.map(({displayName, name}) => ({displayName, name})),
		);
	});

	it('creates an eid entry', async () => {
		const userId = randomUserId();

		const eid = newEidData();

		const patientId = await newPatient({userId});

		await invoke(updateFromEid, {userId}, [patientId, eid]);

		const entries = await Eids.find({owner: userId}).fetchAsync();

		assert.strictEqual(entries.length, 1);

		const {_id, createdAt, lastUsedAt, owner, ...rest} = entries[0]!;

		assert.strictEqual(owner, userId);
		assert.isAtMost(createdAt.valueOf(), Date.now());
		assert.strictEqual(lastUsedAt.valueOf(), createdAt.valueOf());

		assert.deepEqual(
			rest,
			Object.fromEntries(
				Object.entries(eid).map(([key, value]) => [
					key,
					removeUndefined(value as {}),
				]),
			),
		);
	});

	it('does not create duplicate eid entries', async () => {
		const userId = randomUserId();

		const eid = newEidData();

		const patientId = await newPatient({userId});

		await invoke(updateFromEid, {userId}, [patientId, eid]);
		const oldEntry = await Eids.findOneAsync({owner: userId});
		assert.isDefined(oldEntry);

		await invoke(updateFromEid, {userId}, [patientId, eid]);
		const entries = await Eids.find({owner: userId}).fetchAsync();

		assert.strictEqual(entries.length, 1);

		const {createdAt, lastUsedAt} = entries[0]!;
		assert.strictEqual(createdAt.valueOf(), oldEntry.createdAt.valueOf());
		assert.isAbove(lastUsedAt.valueOf(), oldEntry.lastUsedAt.valueOf());
	});

	it('creates associated Changes entries', async () => {
		const userId = randomUserId();

		const eid = newEidData();

		const patientId = await newPatient({userId}, {firstname: 'Alice'});

		await invoke(updateFromEid, {userId}, [patientId, eid]);

		const {_id: eidId} = (await Eids.findOneAsync({owner: userId}))!;

		const changes = await Changes.find({
			owner: userId,
			'operation.type': 'update',
		}).fetchAsync();

		assert.lengthOf(changes, 1);

		const {operation, what, who, when, why} = changes[0]!;

		assert.deepNestedInclude(operation, {
			'$set.firstname': eid.identity.firstname,
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
			method: 'updateFromEid',
			source: {
				type: 'entity',
				collection: 'eid',
				_id: eidId,
			},
		});
	});
});
