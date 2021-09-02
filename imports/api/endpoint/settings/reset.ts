import {check} from 'meteor/check';

import {Settings, settings} from '../../settings';

import define from '../define';

const {methods} = settings;

export default define({
	name: methods.reset,
	validate(key: string) {
		check(key, String);
	},
	run(key: string) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		return Settings.remove({owner: this.userId, key});
	},
});
