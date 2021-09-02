import {check} from 'meteor/check';

import {Settings, settings} from '../../settings';

import define from '../define';

const {methods} = settings;

export default define({
	name: methods.update,
	validate(key: string, _value: any) {
		check(key, String);
	},
	run(key: string, value: any) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

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
