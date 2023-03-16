import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';
import {
	type ConsultationDocument,
	Consultations,
} from '../../collection/consultations';
import type Selector from '../../QuerySelector';
import type Filter from '../../QueryFilter';
import define from '../define';

export default define({
	name: 'consultations.last',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([
		schema
			.object({
				/* Filter<ConsultationDocument> */
			})
			.nullable(),
	]),
	cursor(filter: Filter<ConsultationDocument> | null) {
		return Consultations.find(
			{
				isDone: true,
				...filter,
				owner: this.userId,
			} as Selector<ConsultationDocument>,
			{
				sort: {
					datetime: -1,
				},
				limit: 1,
			},
		);
	},
});
