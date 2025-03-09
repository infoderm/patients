import {assert} from 'chai';

import {client, randomId, server} from '../../../_test/fixtures';
import call from '../call';
import invoke from '../invoke';

import unregisteredEndpoint from './unregisteredEndpoint';

client(__filename, () => {
	it('should work', async () => {
		const input = randomId();
		const output = await call(unregisteredEndpoint, input);
		assert.strictEqual(output, input);
	});
});

server(__filename, () => {
	it('should work', async () => {
		const input = randomId();
		const output = await invoke(unregisteredEndpoint, {userId: null}, [input]);
		assert.strictEqual(output, input);
	});
});
