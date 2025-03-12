import schema from '../../../util/schema';
import {AuthenticationLoggedIn} from '../../Authentication';
import {
	type ConsultationDocument,
	Consultations,
	consultationDocument,
} from '../../collection/consultations';
import {options} from '../../query/Options';
import type Options from '../../query/Options';
import define from '../define';

export default define({
	name: 'patient.consultations',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string(), options(consultationDocument)]),
	cursor(patientId: string, options: Options<ConsultationDocument>) {
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
