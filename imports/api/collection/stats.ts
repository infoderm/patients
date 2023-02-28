import Collection from '../Collection';

export type PollResult<T> = {
	total: number;
	count: T;
};

export const countCollection = 'stats.count';
export const Count = new Collection<PollResult<any>>(countCollection);
