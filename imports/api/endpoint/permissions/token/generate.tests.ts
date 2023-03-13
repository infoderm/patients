// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';

import {assert} from 'chai';

import {randomUserId, server, throws} from '../../../../_test/fixtures';
import {
	decode,
	encode,
	getPermissionsForToken,
} from '../../../permissions/token';

import invoke from '../../invoke';
import generate from './generate';

server(__filename, () => {
	it('allows to generate a token and use it', async () => {
		const userId = randomUserId();
		const connection = {
			clientAddress: '1.2.3.4',
		};

		const invocation = {userId, connection};

		const permissions = ['a', 'b', 'c'];

		const token = await invoke(generate, invocation, [permissions]);

		const lastUsedIPAddress = '2.3.4.5';

		assert.deepInclude(
			await getPermissionsForToken(token, lastUsedIPAddress, 'b'),
			{
				permissions,
				lastUsedIPAddress,
			},
		);

		assert.deepInclude(
			await getPermissionsForToken(token, lastUsedIPAddress, 'a'),
			{
				permissions,
				lastUsedIPAddress,
			},
		);

		assert.deepInclude(
			await getPermissionsForToken(token, lastUsedIPAddress, 'c'),
			{
				permissions,
				lastUsedIPAddress,
			},
		);

		assert.deepInclude(
			await getPermissionsForToken(token, lastUsedIPAddress, 'b'),
			{
				permissions,
				lastUsedIPAddress,
			},
		);

		assert.deepInclude(
			await getPermissionsForToken(token, lastUsedIPAddress, 'a'),
			{
				permissions,
				lastUsedIPAddress,
			},
		);

		assert.deepInclude(
			await getPermissionsForToken(token, lastUsedIPAddress, 'c'),
			{
				permissions,
				lastUsedIPAddress,
			},
		);
	});

	it('cannot generate a token if not logged in', async () => {
		const userId = null!;
		const connection = {
			clientAddress: '1.2.3.4',
		};

		const invocation = {userId, connection};

		const permissions = ['a', 'b', 'c'];

		return throws(
			async () => invoke(generate, invocation, [permissions]),
			/not-authorized/,
		);
	});

	it('correctly filters based on permissions', async () => {
		const userId = randomUserId();
		const connection = {
			clientAddress: '1.2.3.4',
		};

		const invocation = {userId, connection};

		const permissions = ['a', 'b', 'c'];

		const token = await invoke(generate, invocation, [permissions]);

		const lastUsedIPAddress = '2.3.4.5';

		return throws(
			async () => getPermissionsForToken(token, lastUsedIPAddress, 'x'),
			/PermissionTokenValidationError\(404\)/,
		);
	});

	it('cannot use token without correct key', async () => {
		const userId = randomUserId();
		const connection = {
			clientAddress: '1.2.3.4',
		};

		const invocation = {userId, connection};

		const permissions = ['a', 'b', 'c'];

		const token1 = await invoke(generate, invocation, [permissions]);
		const {_id: _id1, key: key1} = decode(token1);
		const token2 = await invoke(generate, invocation, [permissions]);
		const {_id: _id2, key: key2} = decode(token2);

		const badTokenA = encode(_id1, key2);
		const badTokenB = encode(_id2, key1);

		const lastUsedIPAddress = '2.3.4.5';

		await throws(
			async () => getPermissionsForToken(badTokenA, lastUsedIPAddress, 'a'),
			/PermissionTokenValidationError\(404\)/,
		);

		await throws(
			async () => getPermissionsForToken(badTokenB, lastUsedIPAddress, 'b'),
			/PermissionTokenValidationError\(404\)/,
		);
	});
});
