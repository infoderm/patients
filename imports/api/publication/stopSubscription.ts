import assert from 'assert';

import type Timeout from '../../lib/types/Timeout';

import type SubscriptionHandle from './SubscriptionHandle';
import subscriptionInternals from './subscriptionInternals';
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
		onStop();
	}

	if (entry.refCount === 0) {
		set(key, undefined);
		const sub = subscriptionInternals(handle);
		console.debug({
			what: 'DEACTIVATE',
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
					what: 'UNSUB',
					id: sub.id,
					name: sub.name,
					params: sub.params,
				});
				handle.stop();
			}

			_gcQueue.delete(sub.id);
		}, delay);

		_gcQueue.set(sub.id, timeout);
	}
};

export default stopSubscription;
