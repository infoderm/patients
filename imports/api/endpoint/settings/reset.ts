import {check} from 'meteor/check';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Settings} from '../../collection/settings';

import define from '../define';

export default define({
	name: 'settings.reset',
	authentication: AuthenticationLoggedIn,
	validate(key: string) {
		check(key, String);
	},
	async run(key: string) {
		return Settings.removeAsync({owner: this.userId, key});
	},
});
