import {Settings} from '../../collection/settings';
import define from '../define';

export default define({
	name: 'settings',
	cursor() {
		return Settings.find({owner: this.userId});
	},
});
