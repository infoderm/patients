import Collection from '../../Collection';
import type Selector from '../../QuerySelector';
import {collection, type ConsultationDocument} from '../consultations';

export const key = (query: Selector<ConsultationDocument>) =>
	JSON.stringify(query);

export type ConsultationsStats = {
	count: number;
	total: number;
	first: Date;
	last: Date;
};

export const stats = collection + '.stats';
export const Stats = new Collection<ConsultationsStats>(stats);
