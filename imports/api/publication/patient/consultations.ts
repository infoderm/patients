import {check} from 'meteor/check';
import {
	type ConsultationDocument,
	Consultations,
} from '../../collection/consultations';
import type Options from '../../Options';
import define from '../define';

export default define({
	name: 'patient.consultations',
	cursor(patientId: string, options: Options<ConsultationDocument>) {
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
