import {check} from 'meteor/check';
import {Settings} from '../../collection/settings';
import define from '../define';
import { AuthenticationLoggedIn } from '../../Authentication';

export default define({
	name: 'setting',
	authentication: AuthenticationLoggedIn,
	cursor(key: string) {
		check(key, String);
		return Settings.find({owner: this.userId, key});
	},
});
