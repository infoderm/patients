import {check} from 'meteor/check';
import {Settings} from '../../collection/settings';
import define from '../define';

export default define({
	name: 'setting',
	cursor(key: string) {
		check(key, String);
		return Settings.find({owner: this.userId, key});
	},
});
