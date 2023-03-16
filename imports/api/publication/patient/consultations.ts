import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';
import {
	type ConsultationDocument,
	Consultations,
} from '../../collection/consultations';
import type Options from '../../QueryOptions';
import define from '../define';

export default define({
	name: 'patient.consultations',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([
		schema.string(),
		schema.object({
			/* TODO */
		}),
	]),
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
