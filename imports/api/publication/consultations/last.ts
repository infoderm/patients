import {Consultations} from '../../collection/consultations';
import define from '../define';

export default define({
	name: 'consultations.last',
	cursor(filter) {
		return Consultations.find(
			{
				isDone: true,
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
