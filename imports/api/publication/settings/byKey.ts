import {Settings} from '../../collection/settings';
import define from '../define';
import {AuthenticationLoggedIn} from '../../Authentication';
import schema from '../../../util/schema';

export default define({
	name: 'setting',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string()]),
	cursor(key) {
		return Settings.find({owner: this.userId, key});
	},
});
