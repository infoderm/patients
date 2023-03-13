import {check} from 'meteor/check';
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
	cursor(from: Date, to: Date, filter?: Filter<ConsultationDocument>) {
		check(from, Date);
		check(to, Date);
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
