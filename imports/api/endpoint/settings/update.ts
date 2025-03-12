import schema from '../../../util/schema';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Settings} from '../../collection/settings';

import define from '../define';

export default define({
	name: 'settings.update',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string(), schema.any(/* TODO */)]),
	async run(key, value) {
		// const updatedAt = new Date();
		const owner = this.userId;
		// const username = await Meteor.users.findOneAsync(this.userId).username;

		return Settings.upsertAsync(
			{owner, key},
			{
				$set: {
					owner,
					key,
					value,
				},
			},
		);
	},
});
