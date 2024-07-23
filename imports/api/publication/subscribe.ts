import {Meteor} from 'meteor/meteor';

import type Args from '../Args';

import type Publication from './Publication';
import type SubscriptionHandle from './SubscriptionHandle';
import subscriptionInternals, {
	debugMeteorSubscriptions,
} from './subscriptionInternals';
import type SubscriptionCallbacks from './SubscriptionCallbacks';
import {get, identify, set} from './subscriptionRegistry';
import type SubscriptionError from './SubscriptionError';

const _parseCallbacks = <A extends Args>(
	args: [...A, SubscriptionCallbacks?],
): [A[], SubscriptionCallbacks | undefined] => {
	if (args.length > 0) {
		const head = args.slice(0, -1) as A[];
		const tail = args[args.length - 1];
		if (typeof tail === 'function') {
			return [head, {onReady: tail as () => void}];
		}

		if (
			tail &&
			[
				// @ts-expect-error We are testing the shape of the argument.
				tail.onReady,
				// XXX COMPAT WITH
				// 1.0.3.1 onError used to
				// exist, but now we use
				// onStop with an error callback instead.
				// @ts-expect-error We are testing the shape of the argument.
				tail.onError,
				// @ts-expect-error We are testing the shape of the argument.
				tail.onStop,
			].some((f) => typeof f === 'function')
		) {
			return [head, tail as SubscriptionCallbacks];
		}
	}

	return [args as unknown as A[], undefined];
};

const subscribe = <A extends Args>(
	{name}: Publication<A>,
	...args: [...A, SubscriptionCallbacks?]
): SubscriptionHandle => {
	const [params, callbacks] = _parseCallbacks(args);
	const key = identify(name, params);
	const entry = get(key);
	let handle: Meteor.SubscriptionHandle;
	if (entry === undefined) {
		const onReady = new Set(
			callbacks?.onReady === undefined ? [] : [callbacks.onReady],
		);
		const onStop = new Set(
			callbacks?.onStop === undefined ? [] : [callbacks.onStop],
		);
		handle = Meteor.subscribe(name, ...params, {
			onReady() {
				Promise.allSettled(
					Array.from(onReady).map(async (callback) => callback()),
				)
					.then((outcomes) => {
						for (const outcome of outcomes) {
							if (outcome.status === 'rejected') {
								console.error({error: outcome.reason});
							}
						}
					})
					.catch((error: unknown) => {
						console.error({error});
					});
			},
			onStop(error: SubscriptionError) {
				set(key, undefined);
				Promise.allSettled(
					Array.from(onStop).map(async (callback) => callback(error)),
				)
					.then((outcomes) => {
						for (const outcome of outcomes) {
							if (outcome.status === 'rejected') {
								console.error({error: outcome.reason});
							}
						}
					})
					.catch((error: unknown) => {
						console.error({error});
					});
			},
		});
		set(key, {handle, refCount: 1, onReady, onStop});
	} else {
		++entry.refCount;
		handle = entry.handle;
		const internals = subscriptionInternals(handle);
		if (callbacks?.onReady !== undefined) {
			if (internals.ready) {
				const maybePromise = callbacks.onReady();
				if (maybePromise instanceof Promise) {
					maybePromise.catch((error: unknown) => {
						console.error({error});
					});
				}
			} else {
				entry.onReady.add(callbacks.onReady);
			}
		}

		if (callbacks?.onStop !== undefined) entry.onStop.add(callbacks.onStop);
	}

	debugMeteorSubscriptions();

	return {key, handle, onReady: callbacks?.onReady, onStop: callbacks?.onStop};
};

export default subscribe;
