import {Mongo} from 'meteor/mongo';
import {collection, ConsultationDocument} from '../consultations';

export const key = (query: Mongo.Selector<ConsultationDocument>) =>
	JSON.stringify(query);

export interface ConsultationsStats {
	count: number;
	total: number;
	first: Date;
	last: Date;
}

export const stats = collection + '.stats';
export const Stats = new Mongo.Collection<ConsultationsStats>(stats);
