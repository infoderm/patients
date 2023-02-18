import {check} from 'meteor/check';

import {Settings} from '../../collection/settings';

import define from '../define';

export default define({
	name: 'settings.update',
	validate(key: string, _value: any) {
		check(key, String);
	},
	async run(key: string, value: any) {
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
