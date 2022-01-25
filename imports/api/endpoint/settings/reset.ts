import {check} from 'meteor/check';

import {Settings} from '../../collection/settings';
import {settings} from '../../settings';

import define from '../define';

const {methods} = settings;

export default define({
	name: methods.reset,
	validate(key: string) {
		check(key, String);
	},
	run(key: string) {
		return Settings.remove({owner: this.userId, key});
	},
});
