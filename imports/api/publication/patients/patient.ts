import {check} from 'meteor/check';

import {type PatientDocument, Patients} from '../../collection/patients';
import type Options from '../../Options';

import define from '../define';

export default define({
	name: 'patient',
	cursor(_id: string, options?: Options<PatientDocument>) {
		check(_id, String);
		return Patients.find({owner: this.userId, _id}, options);
	},
});
