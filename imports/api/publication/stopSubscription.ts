import assert from 'assert';

import {defer, type Deferred} from '../../lib/async/defer';

import type SubscriptionHandle from './SubscriptionHandle';
import {debugMeteorSubscriptions} from './subscriptionInternals';
import {get, set} from './subscriptionRegistry';

const _gcQueue = new Map<string, Deferred>();

const stopSubscription = (
	{key, handle, onReady, onStop}: SubscriptionHandle,
	delay = 0,
) => {
	const entry = get(key);
	if (entry === undefined) {
		// console.debug({
		// what: 'stopSubscription',
		// msg: `subscription ${key} already stopped`,
		// });
		return;
	}

	--entry.refCount;
	assert(entry.refCount >= 0, `Negative refCount for ${key}.`);
	if (onReady !== undefined) entry.onReady.delete(onReady);
	if (onStop !== undefined) {
		entry.onStop.delete(onStop);
		const maybePromise = onStop();
		if (maybePromise instanceof Promise) {
			maybePromise.catch((error: unknown) => {
				console.error({error});
			});
		}
	}

	if (entry.refCount === 0) {
		const sub = entry.internals;
		// console.debug({
		// what: 'stopSubscription',
		// msg: 'refCount === 0',
		// id: sub.id,
		// name: sub.name,
		// params: sub.params,
		// });
		sub.inactive = true;
		const prev = _gcQueue.get(sub.id);
		if (prev !== undefined) prev.cancel();

		const next = defer(() => {
			if (sub.inactive) {
				// console.debug({
				// what: 'stopSubscription',
				// msg: 'unsub',
				// id: sub.id,
				// name: sub.name,
				// params: sub.params,
				// });
				set(key, undefined);
				handle.stop();
				debugMeteorSubscriptions();
			}

			_gcQueue.delete(sub.id);
		}, delay);

		_gcQueue.set(sub.id, next);
	}
};

export default stopSubscription;
