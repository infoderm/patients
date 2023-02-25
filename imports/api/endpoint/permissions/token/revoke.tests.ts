// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';

import {randomUserId, server, throws} from '../../../../_test/fixtures';
import {decode, getPermissionsForToken} from '../../../permissions/token';

import invoke from '../../invoke';
import generate from './generate';
import revoke from './revoke';

server(__filename, () => {
	it('allows to revoke a token', async () => {
		const userId = randomUserId();
		const connection = {
			clientAddress: '1.2.3.4',
		};

		const invocation = {userId, connection} as Meteor.MethodThisType;

		const permissions = ['a', 'b', 'c'];

		const token = await invoke(generate, invocation, [permissions]);

		const {_id} = decode(token);

		await invoke(revoke, invocation, [_id]);

		const lastUsedIPAddress = '2.3.4.5';

		return throws(
			async () => getPermissionsForToken(token, lastUsedIPAddress, 'a'),
			/PermissionTokenValidationError\(404\)/,
		);
	});

	it('cannot revoke a token you do not own', async () => {
		const userId = randomUserId();
		const connection = {
			clientAddress: '1.2.3.4',
		};

		const invocation = {userId, connection} as Meteor.MethodThisType;

		const permissions = ['a', 'b', 'c'];

		const token = await invoke(generate, invocation, [permissions]);

		const {_id} = decode(token);

		return throws(
			async () => invoke(revoke, {userId: `${userId}x`}, [_id]),
			/not-found/,
		);
	});

	it('cannot revoke a token if not logged in', async () => {
		const userId = randomUserId();
		const connection = {
			clientAddress: '1.2.3.4',
		};

		const invocation = {userId, connection} as Meteor.MethodThisType;

		const permissions = ['a', 'b', 'c'];

		const token = await invoke(generate, invocation, [permissions]);

		const {_id} = decode(token);

		return throws(
			async () => invoke(revoke, {userId: undefined}, [_id]),
			/not-authorized/,
		);
	});
});
