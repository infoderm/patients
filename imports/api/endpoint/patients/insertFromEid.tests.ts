import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../_test/fixtures';

import {Eids} from '../../collection/eids';
import {Patients} from '../../collection/patients';
import {Allergies} from '../../collection/allergies';
import {Doctors} from '../../collection/doctors';
import {Insurances} from '../../collection/insurances';

import {newEidData} from '../../_dev/populate/eids';
import invoke from '../invoke';

import {normalizedName, patientFieldsFromEid} from '../../patients';

import removeUndefined from '../../../util/object/removeUndefined';

import {Changes} from '../../collection/changes';

import insertFromEid from './insertFromEid';

server(__filename, () => {
	it('cannot create a patient when not logged in', async () => {
		return throws(
			async () =>
				invoke(
					insertFromEid,
					// @ts-expect-error Type-checking is working as expected.
					{userId: undefined},
					[newEidData()],
				),
			/not-authorized/,
		);
	});

	it('can create a patient when logged in', async () => {
		const userId = randomUserId();

		const eid = newEidData();

		const patientId = await invoke(insertFromEid, {userId}, [eid]);

		const patients = await Patients.find({owner: userId}).fetchAsync();

		assert.strictEqual(patients.length, 1);

		const expectedPatientFields = patientFieldsFromEid(eid);
		const expectedComputedFields = {
			normalizedName: normalizedName(
				expectedPatientFields.firstname,
				expectedPatientFields.lastname,
			),
		};

		const expected = removeUndefined({
			...expectedPatientFields,
			...expectedComputedFields,
		});
		const {_id, createdAt, owner, ...actual} = patients[0]!;

		assert.strictEqual(patientId, _id);

		assert.strictEqual(owner, userId);

		assert.deepEqual(actual, expected);

		assert.isAtMost(createdAt.valueOf(), Date.now());

		assert.sameDeepMembers(await Allergies.find().fetchAsync(), []);
		assert.sameDeepMembers(await Doctors.find().fetchAsync(), []);
		assert.sameDeepMembers(await Insurances.find().fetchAsync(), []);
	});

	it('creates an eid entry', async () => {
		const userId = randomUserId();

		const eid = newEidData();

		await invoke(insertFromEid, {userId}, [eid]);

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

		await invoke(insertFromEid, {userId}, [eid]);
		const oldEntry = await Eids.findOneAsync({owner: userId});
		assert.isDefined(oldEntry);

		await invoke(insertFromEid, {userId}, [eid]);
		const entries = await Eids.find({owner: userId}).fetchAsync();

		assert.strictEqual(entries.length, 1);

		const {createdAt, lastUsedAt} = entries[0]!;
		assert.strictEqual(createdAt.valueOf(), oldEntry.createdAt.valueOf());
		assert.isAbove(lastUsedAt.valueOf(), oldEntry.lastUsedAt.valueOf());
	});

	it('creates associated Changes entries', async () => {
		const userId = randomUserId();

		const eid = newEidData();

		const patientId = await invoke(insertFromEid, {userId}, [eid]);

		const {_id: eidId} = (await Eids.findOneAsync({owner: userId}))!;

		const changes = await Changes.find({
			owner: userId,
			'operation.type': 'create',
		}).fetchAsync();

		assert.lengthOf(changes, 1);

		const {operation, what, who, when, why} = changes[0]!;

		assert.deepNestedInclude(
			operation,
			removeUndefined({
				type: 'create',
				'$set.owner': userId,
				'$set.firstname': eid.identity.firstname,
				'$set.lastname': eid.identity.name,
				'$set.municipality': eid.address.municipality,
				'$set.niss': eid.identity.nationalnumber,
				'$set.sex': eid.identity.gender,
				'$set.streetandnumber': eid.address.streetandnumber,
				'$set.zip': eid.address.zip,
			}),
		);

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
			method: 'insertFromEid',
			source: {
				type: 'entity',
				collection: 'eid',
				_id: eidId,
			},
		});
	});
});
