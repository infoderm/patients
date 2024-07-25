import type Timeout from '../types/Timeout';

import createPromise from './createPromise';

type Resolve = (value?: any) => void;
type Reject = (reason?: any) => void;

type Callback<A extends any[]> = (...args: A) => void;

const _pending = new Set<Deferred>();

export class Deferred {
	#timeout: Timeout;
	#resolve: Resolve;
	#reject: Reject;

	constructor(timeout: Timeout, resolve: Resolve, reject: Reject) {
		this.#timeout = timeout;
		this.#resolve = resolve;
		this.#reject = reject;
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

export const defer = <A extends any[]>(
	callback: Callback<A>,
	timeout?: number,
	...args: A
): Deferred => {
	const {promise, resolve, reject} = createPromise();
	promise
		.then(
			() => {
				_pending.delete(deferred);
				callback(...args);
			},

			() => {
				// NOTE This handles cancellation.
			},
		)
		.catch((error: unknown) => {
			console.error({error});
		});
	const deferred = new Deferred(setTimeout(resolve, timeout), resolve, reject);
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
