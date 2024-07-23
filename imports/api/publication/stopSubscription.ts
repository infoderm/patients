import assert from 'assert';

import type Timeout from '../../lib/types/Timeout';

import type SubscriptionHandle from './SubscriptionHandle';
import subscriptionInternals, {
	debugMeteorSubscriptions,
} from './subscriptionInternals';
import {get, set} from './subscriptionRegistry';

const _gcQueue = new Map<string, Timeout>();

const stopSubscription = (
	{key, handle, onReady, onStop}: SubscriptionHandle,
	delay = 0,
) => {
	const entry = get(key);
	if (entry === undefined) {
		console.debug({
			what: 'stopSubscription',
			msg: `subscription ${key} already stopped`,
		});
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
		set(key, undefined);
		const sub = subscriptionInternals(handle);
		console.debug({
			what: 'stopSubscription',
			msg: 'refCount === 0',
			id: sub.id,
			name: sub.name,
			params: sub.params,
		});
		sub.inactive = true;
		const queued = _gcQueue.get(sub.id);
		if (queued) clearTimeout(queued);

		const timeout = setTimeout(() => {
			if (sub.inactive) {
				console.debug({
					what: 'stopSubscription',
					msg: 'unsub',
					id: sub.id,
					name: sub.name,
					params: sub.params,
				});
				handle.stop();
				debugMeteorSubscriptions();
			}

			_gcQueue.delete(sub.id);
		}, delay);

		_gcQueue.set(sub.id, timeout);
	}
};

export default stopSubscription;
