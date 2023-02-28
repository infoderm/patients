import Collection from '../Collection';

export type State = {
	count: number;
};

export const noShows = 'noShows';
export const NoShows = new Collection<State>(noShows);
