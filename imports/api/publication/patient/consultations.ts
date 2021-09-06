import {check} from 'meteor/check';
import {Consultations} from '../../collection/consultations';
import define from '../define';

export default define({
	name: 'patient.consultations',
	cursor(patientId: string, options) {
		check(patientId, String);
		return Consultations.find(
			{
				owner: this.userId,
				isDone: true,
				patientId,
			},
			options,
		);
	},
});
