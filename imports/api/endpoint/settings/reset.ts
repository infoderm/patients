import schema from '../../../util/schema';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Settings} from '../../collection/settings';

import define from '../define';

export default define({
	name: 'settings.reset',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string()]),
	async run(key) {
		return Settings.removeAsync({owner: this.userId, key});
	},
});
