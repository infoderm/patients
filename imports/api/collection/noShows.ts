import {Mongo} from 'meteor/mongo';

export interface State {
	count: number;
}

export const noShows = 'noShows';
export const NoShows = new Mongo.Collection<State>(noShows);
