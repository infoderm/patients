import {check} from 'meteor/check';

import {Patients} from '../../collection/patients';

import define from '../define';

export default define({
	name: '/patients/find',
	validate(query: any, options: any) {
		check(query, Object);
		check(options, Object);
	},
	async run(query: any, options: any) {
		return Patients.find({...query, owner: this.userId}, options).fetch();
	},
	simulate(_query: any, _options: any) {
		throw new Error('simulation not-implemented');
	},
});
