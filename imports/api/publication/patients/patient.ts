import {check} from 'meteor/check';

import {Patients} from '../../collection/patients';

import define from '../define';

export default define({
	name: 'patient',
	cursor(_id, options) {
		check(_id, String);
		return Patients.find({owner: this.userId, _id}, options);
	},
});
