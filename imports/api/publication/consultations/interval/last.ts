import {check} from 'meteor/check';
import {Consultations} from '../../../collection/consultations';
import define from '../../define';

export default define({
	name: 'consultations.interval.last',
	cursor(from: Date, to: Date, filter) {
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
			},
			{
				sort: {
					datetime: -1,
				},
				limit: 1,
			},
		);
	},
});
