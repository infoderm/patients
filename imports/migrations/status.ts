import createPromise from '../util/async/createPromise';

const {promise, resolve, reject} = createPromise<true>();

export const isDone = async () => promise;

export const setFailed = (error: Error) => {
	reject(error);
};

export const setDone = () => {
	console.debug('migrations are done');
	resolve(true);
};
