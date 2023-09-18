import define from './define';

export type State = {
	count: number;
};

export const noShows = 'noShows';
export const NoShows = define<State>(noShows);
