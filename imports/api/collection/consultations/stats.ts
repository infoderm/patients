import {Mongo} from 'meteor/mongo';
import {collection} from '../consultations';

export const key = (query, init = undefined) => JSON.stringify({query, init});

export interface ConsultationsStats {
	count: number;
	total: number;
	first: Date;
	last: Date;
}

export const stats = collection + '.stats';
export const Stats = new Mongo.Collection<ConsultationsStats>(stats);
