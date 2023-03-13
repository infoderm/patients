import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';
import {
	type ConsultationDocument,
	Consultations,
} from '../../collection/consultations';
import type Options from '../../Options';
import define from '../define';

export default define({
	name: 'consultation',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([
		schema.string(),
		schema
			.object({
				/* TODO Options<ConsultationDocument> */
			})
			.optional(),
	]),
	cursor(_id, options?: Options<ConsultationDocument>) {
		return Consultations.find(
			{
				owner: this.userId,
				_id,
			},
			options,
		);
	},
});
