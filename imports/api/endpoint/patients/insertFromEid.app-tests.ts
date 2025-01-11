import {assert} from 'chai';

import {randomUserId, server} from '../../../_test/fixtures';

import {Eids} from '../../collection/eids';

import {newEidData} from '../../_dev/populate/eids';
import invoke from '../invoke';

import insertFromEid from './insertFromEid';

server(__filename, () => {
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
});
