import type Timeout from '../types/Timeout';

import createPromise from './createPromise';

type Resolve = (value?: any) => void;
type Reject = (reason?: any) => void;

type Callback<A extends any[], R> = (...args: A) => Promise<R> | R;

const _pending = new Set<Deferred<unknown>>();

export class Deferred<R = unknown> {
	#timeout: Timeout;
	#promise: Promise<R | void>;
	#resolve: Resolve;
	#reject: Reject;

	constructor(timeout: Timeout, promise: Promise<R | void>, resolve: Resolve, reject: Reject) {
		this.#timeout = timeout;
		this.#promise = promise;
		this.#resolve = resolve;
		this.#reject = reject;
	}

	resolution() {
		return this.#promise;
	}

	cancel() {
		if (!_pending.has(this)) return;
		_pending.delete(this);
		clearTimeout(this.#timeout);
		this.#reject();
	}

	flush() {
		if (!_pending.has(this)) return;
		_pending.delete(this);
		clearTimeout(this.#timeout);
		this.#resolve();
	}
}

export const defer = <A extends any[], R>(
	callback: Callback<A, R>,
	timeout?: number,
	...args: A
): Deferred<R> => {
	const {promise, resolve, reject} = createPromise();
	const resolution = promise
		.then(
			async () => {
				_pending.delete(deferred);
				return callback(...args);
			},

			() => {
				// NOTE: This handles cancellation.
			},
		)
		.catch((error: unknown) => {
			console.error({error});
		});
	const deferred = new Deferred(
		setTimeout(resolve, timeout),
		resolution,
		resolve,
		reject
	);
	_pending.add(deferred);
	return deferred;
};

const _cancelAll = (pending: Iterable<Deferred>) => {
	for (const deferred of pending) deferred.cancel();
};

export const cancelAll = () => {
	_cancelAll(_pending);
	_pending.clear();
};

const _flushAll = (pending: Iterable<Deferred>) => {
	for (const deferred of pending) deferred.flush();
};

export const flushAll = () => {
	_flushAll(_pending);
	_pending.clear();
};
