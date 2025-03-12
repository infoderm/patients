import schema from '../../../util/schema';
import {AuthenticationLoggedIn} from '../../Authentication';
import {Settings} from '../../collection/settings';
import define from '../define';

export default define({
	name: 'settings',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([]),
	cursor() {
		return Settings.find({owner: this.userId});
	},
});
