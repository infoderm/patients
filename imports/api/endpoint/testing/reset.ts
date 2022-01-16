import reset from '../../reset';
import define from '../define';

export default define({
	testOnly: true,
	name: 'dev.testing.data.reset',
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
