import {check} from 'meteor/check';
import {AuthenticationLoggedIn} from '../../Authentication';
import {
	type ConsultationDocument,
	Consultations,
} from '../../collection/consultations';
import type Options from '../../Options';
import define from '../define';

export default define({
	name: 'patient.consultations',
	authentication: AuthenticationLoggedIn,
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
