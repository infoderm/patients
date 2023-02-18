import {check} from 'meteor/check';

import {type PatientDocument, Patients} from '../../collection/patients';

import define from '../define';

export default define({
	name: '/patients/find',
	validate(query: any, options: any) {
		check(query, Object);
		check(options, Object);
	},
	async run(
		query: any,
		options: any,
	): Promise<Array<Partial<PatientDocument>>> {
		return Patients.find({...query, owner: this.userId}, options).fetchAsync();
	},
	simulate(_query: any, _options: any) {
		return undefined;
	},
});
