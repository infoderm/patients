import schema from '../../../util/schema';
import {AuthenticationLoggedIn} from '../../Authentication';
import {
	type ConsultationDocument,
	Consultations,
	consultationDocument,
} from '../../collection/consultations';
import type Selector from '../../query/Selector';
import define from '../define';
import {userFilter} from '../../query/UserFilter';
import type UserFilter from '../../query/UserFilter';

export default define({
	name: 'consultations.last',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([userFilter(consultationDocument).nullable()]),
	cursor(filter: UserFilter<ConsultationDocument> | null) {
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
