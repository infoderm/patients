import {AuthenticationDangerousNone} from '../../Authentication';
import schema from '../../../util/schema';
import reset from '../../reset';
import define from '../define';

export default define({
	testOnly: true,
	authentication: AuthenticationDangerousNone,
	name: 'dev.reset',
	schema: schema.tuple([]),
	async run() {
		return reset();
	},
	simulate() {
		return undefined;
	},
});
