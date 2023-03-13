import {AuthenticationDangerousNone} from '../../Authentication';
import reset from '../../reset';
import define from '../define';

export default define({
	testOnly: true,
	authentication: AuthenticationDangerousNone,
	name: 'dev.reset',
	validate() {
		return undefined;
	},
	async run() {
		return reset();
	},
	simulate() {
		return undefined;
	},
});
