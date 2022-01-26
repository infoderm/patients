import reset from '../../reset';
import define from '../define';

export default define({
	testOnly: true,
	authentication: 'DANGEROUS-NONE',
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
