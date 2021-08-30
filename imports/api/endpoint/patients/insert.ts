import {check} from 'meteor/check';

import {Patients, patients} from '../../patients';

import define from '../define';

const {sanitize, updateIndex, updateTags} = patients;

export default define({
	name: '/api/patients/insert',
	validate(patient: any) {
		check(patient, Object);
	},
	async run(patient: any) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const fields = sanitize(patient);

		updateTags(this.userId, fields);

		const patientId = Patients.insert({
			...fields,
			createdAt: new Date(),
			owner: this.userId,
		});

		updateIndex(this.userId, patientId, fields);

		return patientId;
	},
});
