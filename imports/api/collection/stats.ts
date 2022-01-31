import {Mongo} from 'meteor/mongo';

export interface PollResult<T> {
	total: number;
	count: T;
}

export const countCollection = 'stats.count';
export const Count = new Mongo.Collection<PollResult<any>>(countCollection);
