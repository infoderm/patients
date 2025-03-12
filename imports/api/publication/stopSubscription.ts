import assert from 'assert';

import {defer, type Deferred} from '../../util/async/defer';

import type SubscriptionRegistryEntry from './SubscriptionRegistryEntry';
import {get, set} from './subscriptionRegistry';

const _gcQueue = new Map<string, Deferred>();

const stopSubscription = (
	{id, key, onReady, onStop}: SubscriptionRegistryEntry,
	delay = 0,
) => {
	const entry = get(key);
	if (entry === undefined) {
		return;
	}

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
		sub.inactive = true;
		const prev = _gcQueue.get(sub.id);
		if (prev !== undefined) prev.cancel();

		const next = defer(() => {
			if (sub.inactive) {
				set(key, undefined);
				entry.handle.stop();
			}

			_gcQueue.delete(sub.id);
		}, delay);

		_gcQueue.set(sub.id, next);
	}
};

export default stopSubscription;
