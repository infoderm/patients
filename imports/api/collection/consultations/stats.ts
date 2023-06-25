import sortKeys from 'sort-keys';

import Collection from '../../Collection';
import type Filter from '../../query/Filter';
import {collection, type ConsultationDocument} from '../consultations';

export const key = (query: Filter<ConsultationDocument>) =>
	JSON.stringify(sortKeys(query, {deep: true}));

export type ConsultationsStats = {
	count: number;
	total: number;
	first: Date;
	last: Date;
};

export const stats = collection + '.stats';
export const Stats = new Collection<ConsultationsStats>(stats);
