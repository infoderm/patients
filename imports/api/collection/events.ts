import {Mongo} from 'meteor/mongo';

export interface EventDocument {
	owner: string;
	calendar: string;
	title: string;
	description: string;
	begin: Date;
	end: Date;
	isCancelled: boolean;
	isNoShow: boolean;
	uri: string;
}

export const events = 'events';
export const Events = new Mongo.Collection<EventDocument>(events);
