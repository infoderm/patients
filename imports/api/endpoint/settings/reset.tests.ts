import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../_test/fixtures';

import invoke from '../invoke';
import {defaults, get} from '../../settings';

import update from './update';
import reset from './reset';

server(__filename, () => {
	it('can reset a setting', async () => {
		const userId = randomUserId();

		const key = 'currency';
		const value = 123_819_832;

		assert.strictEqual(await get(userId, key), defaults[key]);

		await invoke(update, {userId}, [key, value]);

		assert.strictEqual(await get(userId, key), value);

		await invoke(reset, {userId}, [key]);

		assert.strictEqual(await get(userId, key), defaults[key]);
	});

	it('is idempotent', async () => {
		const userId = randomUserId();

		const key = 'x';
		const value = 123_819_832;

		assert.strictEqual(await get(userId, key), defaults[key]);

		await invoke(reset, {userId}, [key]);

		assert.strictEqual(await get(userId, key), defaults[key]);

		await invoke(update, {userId}, [key, value]);

		assert.strictEqual(await get(userId, key), value);

		await invoke(reset, {userId}, [key]);

		assert.strictEqual(await get(userId, key), defaults[key]);

		await invoke(reset, {userId}, [key]);

		assert.strictEqual(await get(userId, key), defaults[key]);
	});

	it('cannot reset a setting if not logged in', async () => {
		const key = 'x';

		return throws(
			async () => invoke(reset, {userId: undefined!}, [key]),
			/not-authorized/,
		);
	});

	it("does not reset other user's settings", async () => {
		const userId = randomUserId();

		const key = 'currency';
		const value = 123_819_832;
		const valueX = `x${value}`;

		await invoke(update, {userId}, [key, value]);
		await invoke(update, {userId: `${userId}x`}, [key, valueX]);

		assert.strictEqual(await get(userId, key), value);
		assert.strictEqual(await get(`${userId}x`, key), valueX);

		await invoke(reset, {userId}, [key]);
		assert.strictEqual(await get(`${userId}x`, key), valueX);

		await invoke(reset, {userId}, [key]);
		assert.strictEqual(await get(`${userId}x`, key), valueX);
	});
});
