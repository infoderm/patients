import {check} from 'meteor/check';
import {AuthenticationLoggedIn} from '../../../Authentication';

import {PermissionTokens} from '../../../collection/permissionTokens';

import define from '../../define';

export default define({
	name: 'permissions.token.revoke',
	authentication: AuthenticationLoggedIn,
	validate(_id: string) {
		check(_id, String);
	},
	async run(_id: string) {
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
