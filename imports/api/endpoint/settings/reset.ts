import {check} from 'meteor/check';

import {Settings} from '../../collection/settings';

import define from '../define';

export default define({
	name: 'settings.reset',
	validate(key: string) {
		check(key, String);
	},
	run(key: string) {
		return Settings.remove({owner: this.userId, key});
	},
});
