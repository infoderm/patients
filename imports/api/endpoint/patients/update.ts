import {check} from 'meteor/check';

import {Patients, patients} from '../../patients';

import define from '../define';

const {sanitize, updateIndex, updateTags} = patients;

export default define({
	name: '/api/patients/update',
	validate(patientId: string, newfields: any) {
		check(patientId, String);
		check(newfields, Object);
	},
	async run(patientId: string, newfields: any) {
		check(patientId, String);
		const patient = Patients.findOne(patientId);
		if (patient.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const fields = sanitize(newfields);

		updateTags(this.userId, fields);

		updateIndex(this.userId, patientId, fields);

		return Patients.update(patientId, {$set: fields});
	},
});
