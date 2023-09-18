import define from './define';

export type PollResult<T> = {
	total: number;
	count: T;
};

export const countCollection = 'stats.count';
export const Count = define<PollResult<any>>(countCollection);
