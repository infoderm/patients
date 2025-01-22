import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../_test/fixtures';

import {Patients} from '../../collection/patients';
import {Allergies} from '../../collection/allergies';
import {Doctors} from '../../collection/doctors';
import {Insurances} from '../../collection/insurances';

import {newEidData} from '../../_dev/populate/eids';
import invoke from '../invoke';

import {normalizedName, patientFieldsFromEid} from '../../patients';

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

		const expected = {
			...expectedPatientFields,
			...expectedComputedFields,
		};
		const {_id, createdAt, owner, ...actual} = patients[0]!;

		assert.strictEqual(patientId, _id);

		assert.strictEqual(owner, userId);

		assert.deepEqual(actual, expected);

		assert.isAtMost(createdAt.valueOf(), Date.now());

		assert.sameDeepMembers(await Allergies.find().fetchAsync(), []);
		assert.sameDeepMembers(await Doctors.find().fetchAsync(), []);
		assert.sameDeepMembers(await Insurances.find().fetchAsync(), []);
	});
});
