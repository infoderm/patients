import {Meteor} from 'meteor/meteor';

import {map} from '@iterable-iterator/map';

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

const _runCallbacks = <A extends any[], R>(run: (callback: (...args: A) => R) => R, callbacks: Iterable<(...a: A) => R>) => {
	Promise.allSettled(map(run, callbacks))
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
}

const _callbacks = <T>(init: T | undefined) => new Set(init === undefined ? [] : [init]);

const subscribe = <A extends Args>(
	{name}: Publication<A>,
	...args: [...A, SubscriptionCallbacks?]
): SubscriptionHandle => {
	const [params, callbacks] = _parseCallbacks(args);
	const key = identify(name, params);
	const entry = get(key);
	let handle: Meteor.SubscriptionHandle;
	if (entry === undefined) {
		const onReady = _callbacks(callbacks?.onReady);
		const onStop = _callbacks(callbacks?.onStop);
		handle = Meteor.subscribe(name, ...params, {
			onReady() {
				_runCallbacks(
					async (callback) => callback(),
					onReady,
				)
			},
			onStop(error: SubscriptionError) {
				set(key, undefined);
				_runCallbacks(
					async (callback) => callback(error),
					onStop,
				)
			},
		});
		const internals = subscriptionInternals(handle);
		set(key, {handle, internals, refCount: 1, onReady, onStop});
	} else {
		++entry.refCount;
		handle = entry.handle;
		if (callbacks?.onReady !== undefined) {
			if (entry.internals.ready) {
				const maybePromise = callbacks.onReady();
				Promise.resolve(maybePromise)
					.catch((error: unknown) => {
						console.error({error});
					});
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
