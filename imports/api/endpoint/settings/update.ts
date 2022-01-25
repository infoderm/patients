import {check} from 'meteor/check';

import {Settings} from '../../collection/settings';
import {settings} from '../../settings';

import define from '../define';

const {methods} = settings;

export default define({
	name: methods.update,
	validate(key: string, _value: any) {
		check(key, String);
	},
	run(key: string, value: any) {
		// const updatedAt = new Date();
		const owner = this.userId;
		// const username = Meteor.users.findOne(this.userId).username;

		return Settings.upsert(
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
