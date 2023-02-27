import {
	type ConsultationDocument,
	Consultations,
} from '../../collection/consultations';
import type Selector from '../../Selector';
import type Filter from '../../transaction/Filter';
import define from '../define';

export default define({
	name: 'consultations.last',
	cursor(filter?: Filter<ConsultationDocument>) {
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
