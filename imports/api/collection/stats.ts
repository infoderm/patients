import {Mongo} from 'meteor/mongo';

export interface PollResult {
	total: number;
	count: any;
}

export const countCollection = 'stats.count';
export const Count = new Mongo.Collection<PollResult>(countCollection);
