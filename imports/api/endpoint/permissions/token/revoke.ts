import {AuthenticationLoggedIn} from '../../../Authentication';
import schema from '../../../../lib/schema';

import {PermissionTokens} from '../../../collection/permissionTokens';

import define from '../../define';

export default define({
	name: 'permissions.token.revoke',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string()]),
	async run(_id) {
		const nRemoved = await PermissionTokens.removeAsync({
			_id,
			owner: this.userId,
		});
		if (nRemoved === 0) {
			throw new Meteor.Error('not-found');
		}

		return nRemoved;
	},
});
