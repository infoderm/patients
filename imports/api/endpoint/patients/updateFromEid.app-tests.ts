import {assert} from 'chai';

import {randomUserId, server} from '../../../_test/fixtures';

import {newPatient} from '../../_dev/populate/patients';
import invoke from '../invoke';

import {newEidData} from '../../_dev/populate/eids';

import {Eids} from '../../collection/eids';

import updateFromEid from './updateFromEid';

server(__filename, () => {
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
});
