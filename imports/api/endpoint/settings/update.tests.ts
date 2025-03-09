import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../_test/fixtures';

import invoke from '../invoke';
import {defaults, get} from '../../settings';

server(__filename, () => {
	it('can set a setting', async () => {
		const {default: update} = await import('./update');
		const userId = randomUserId();

		const key = 'x';
		const value = 123_819_832;

		assert.strictEqual(get(userId, key), defaults[key]);

		await invoke(update, {userId}, [key, value]);

		assert.strictEqual(get(userId, key), value);
	});

	it('can update a setting', async () => {
		const {default: update} = await import('./update');
		const userId = randomUserId();

		const key = 'x';
		const value = 123_819_832;
		const updated = `updated-${value}`;

		await invoke(update, {userId}, [key, value]);

		assert.strictEqual(get(userId, key), value);

		await invoke(update, {userId}, [key, updated]);

		assert.strictEqual(get(userId, key), updated);
	});

	it('cannot set a setting if not logged in', async () => {
		const {default: update} = await import('./update');
		const key = 'x';
		const value = 123_819_832;

		return throws(
			async () => invoke(update, {userId: undefined!}, [key, value]),
			/not-authorized/,
		);
	});

	it('cannot update a setting if not logged in', async () => {
		const {default: update} = await import('./update');
		const userId = randomUserId();

		const key = 'x';
		const value = 123_819_832;
		const updated = `updated-${value}`;

		await invoke(update, {userId}, [key, value]);

		return throws(
			async () => invoke(update, {userId: undefined!}, [key, updated]),
			/not-authorized/,
		);
	});

	it("does not read other user's settings", async () => {
		const {default: update} = await import('./update');
		const userId = randomUserId();

		const key = 'x';
		const value = 123_819_832;

		await invoke(update, {userId}, [key, value]);

		assert.strictEqual(get(`${userId}x`, key), defaults[key]);
	});
});
