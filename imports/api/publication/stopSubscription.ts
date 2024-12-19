import assert from 'assert';

import {defer, type Deferred} from '../../lib/async/defer';

import type SubscriptionRegistryEntry from './SubscriptionRegistryEntry';
import {debugMeteorSubscriptions} from './subscriptionInternals';
import {get, set} from './subscriptionRegistry';

const _gcQueue = new Map<string, Deferred>();

const stopSubscription = (
	{id, key, onReady, onStop}: SubscriptionRegistryEntry,
	delay = 0,
) => {
	const entry = get(key);
	if (entry === undefined) {
		console.debug({
			what: 'stopSubscription',
			msg: `subscription ${key} already stopped`,
			key,
		});
		return;
	}

	// console.debug(JSON.stringify({
	// what: 'stopSubscription',
	// msg: 'request',
	// key,
	// id: entry.internals.id,
	// name: entry.internals.name,
	// params: entry.internals.params,
	// refCount: entry.refCount,
	// }, undefined, 2));

	--entry.refCount;
	assert(entry.refCount >= 0, `Negative refCount for ${key}.`);
	if (onReady !== undefined) entry.onReady.delete(id);
	if (onStop !== undefined) {
		entry.onStop.delete(id);
		const maybePromise = onStop(id);
		if (maybePromise instanceof Promise) {
			maybePromise.catch((error: unknown) => {
				console.error({error});
			});
		}
	}

	if (entry.refCount === 0) {
		const sub = entry.internals;
		// console.debug(JSON.stringify({
		// what: 'stopSubscription',
		// msg: 'refCount === 0',
		// id: sub.id,
		// name: sub.name,
		// params: sub.params,
		// }, undefined, 2));
		sub.inactive = true;
		const prev = _gcQueue.get(sub.id);
		if (prev !== undefined) prev.cancel();

		const next = defer(() => {
			if (sub.inactive) {
				// console.debug(JSON.stringify({
				// what: 'stopSubscription',
				// msg: 'delete',
				// id: sub.id,
				// name: sub.name,
				// params: sub.params,
				// }, undefined, 2));
				set(key, undefined);
				entry.handle.stop();
				debugMeteorSubscriptions();
			}

			_gcQueue.delete(sub.id);
		}, delay);

		_gcQueue.set(sub.id, next);
	}
};

export default stopSubscription;
