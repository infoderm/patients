import {AuthenticationDangerousNone} from '../../Authentication';
import schema from '../../../lib/schema';
import define from '../define';

export default define({
	authentication: AuthenticationDangerousNone,
	name: 'dev.unregisteredEndpoint',
	schema: schema.tuple([schema.string()]),
	async run(value) {
		return value;
	},
	simulate() {
		return undefined;
	},
});
