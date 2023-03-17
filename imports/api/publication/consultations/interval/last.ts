import schema from '../../../../lib/schema';
import {AuthenticationLoggedIn} from '../../../Authentication';
import {
	type ConsultationDocument,
	Consultations,
	consultationDocument,
} from '../../../collection/consultations';
import type Selector from '../../../query/Selector';
import type UserFilter from '../../../query/UserFilter';
import {userFilter} from '../../../query/UserFilter';
import define from '../../define';

export default define({
	name: 'consultations.interval.last',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([
		schema.date(),
		schema.date(),
		userFilter(consultationDocument).nullable(),
	]),
	cursor(from, to, filter: UserFilter<ConsultationDocument> | null) {
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
