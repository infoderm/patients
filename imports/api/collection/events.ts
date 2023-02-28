import Collection from '../Collection';

export type EventDocument = {
	owner: string;
	calendar: string;
	title: string;
	description: string;
	begin: Date;
	end: Date;
	isCancelled: boolean;
	isNoShow: boolean;
	uri: string;
};

export const events = 'events';
export const Events = new Collection<EventDocument>(events);
