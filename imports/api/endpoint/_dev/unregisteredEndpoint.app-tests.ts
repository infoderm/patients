import {assert} from 'chai';

import {client, randomId, server, throws} from '../../../_test/fixtures';
import call from '../call';
import invoke from '../invoke';

import unregisteredEndpoint from './unregisteredEndpoint';

client(__filename, () => {
	it('should not work', async () => {
		const input = randomId();
		await throws(async () => {
			await call(unregisteredEndpoint, input);
		}, "Method 'dev.unregisteredEndpoint' not found [404]");
	});
});

server(__filename, () => {
	it('should work', async () => {
		const input = randomId();
		const output = await invoke(unregisteredEndpoint, {userId: null}, [input]);
		assert.strictEqual(output, input);
	});
});
