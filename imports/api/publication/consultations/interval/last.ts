import schema from '../../../../lib/schema';
import {AuthenticationLoggedIn} from '../../../Authentication';
import {
	type ConsultationDocument,
	Consultations,
} from '../../../collection/consultations';
import type Selector from '../../../Selector';
import type Filter from '../../../transaction/Filter';
import define from '../../define';

export default define({
	name: 'consultations.interval.last',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([
		schema.date(),
		schema.date(),
		schema
			.object({
				/* Filter<ConsultationDocument> */
			})
			.nullable(),
	]),
	cursor(from, to, filter: Filter<ConsultationDocument> | null) {
		return Consultations.find(
			{
				isDone: true,
				datetime: {
					$gte: from,
					$lt: to,
				},
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
