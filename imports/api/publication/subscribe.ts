import {Meteor} from 'meteor/meteor';

import {map} from '@iterable-iterator/map';

import type Args from '../Args';

import type SubscriptionRegistryEntry from './SubscriptionRegistryEntry';
import subscriptionInternals, {
	debugMeteorSubscriptions,
} from './subscriptionInternals';
import {get, identify, set} from './subscriptionRegistry';
import type SubscriptionError from './SubscriptionError';
import {subscriptionId} from './subscriptionId';
import {type Subscription} from './Subscription';

const _runCallbacks = <K, A extends any[], R>(
	run: (callback: [K, (...args: A) => R]) => R,
	callbacks: Iterable<[K, (...a: A) => R]>,
) => {
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
};

const _callbacks = <K, V>(id: K, init: V | undefined) =>
	new Map(init === undefined ? [] : [[id, init]]);

const _safeMaybePromise = (maybePromise: unknown) => {
	Promise.resolve(maybePromise).catch((error: unknown) => {
		console.error({error});
	});
};

const subscribe = <A extends Args>(
	{publication: {name}, args, callbacks}: Subscription<A>,
	enabled = true,
): SubscriptionRegistryEntry => {
	// console.debug(JSON.stringify({
	// what: 'subscribe',
	// msg: 'request',
	// name,
	// params,
	// }, undefined, 2));
	const id = subscriptionId();
	_safeMaybePromise(callbacks?.onSubscribe?.(id));
	const key = identify(name, args);
	if (enabled) {
		const entry = get(key);
		if (entry === undefined) {
			const onReady = _callbacks(id, callbacks?.onReady);
			const onStop = _callbacks(id, callbacks?.onStop);
			const handle = Meteor.subscribe(name, ...args, {
				onReady() {
					_runCallbacks(async ([id, callback]) => callback(id), onReady);
					onReady.clear();
				},
				onStop(error: SubscriptionError) {
					set(key, undefined);
					_runCallbacks(async ([id, callback]) => callback(id, error), onStop);
					onStop.clear();
				},
			});
			const internals = subscriptionInternals(handle);
			const ready = internals.ready;
			if (!ready) _safeMaybePromise(callbacks?.onLoading?.(id));
			set(key, {handle, internals, refCount: 1, onReady, onStop});

			// console.debug(JSON.stringify({
			// what: 'subscribe',
			// msg: 'create',
			// key,
			// id: internals.id,
			// name: internals.name,
			// params: internals.params,
			// }, undefined, 2));
		} else {
			// console.debug(JSON.stringify({
			// what: 'subscribe',
			// msg: 'recycle',
			// key,
			// id: entry.internals.id,
			// name: entry.internals.name,
			// params: entry.internals.params,
			// }, undefined, 2));
			++entry.refCount;
			entry.internals.inactive = false;
			const ready = entry.internals.ready;
			if (!ready) _safeMaybePromise(callbacks?.onLoading?.(id));
			if (callbacks?.onReady !== undefined) {
				if (ready) {
					_safeMaybePromise(callbacks.onReady(id));
				} else {
					entry.onReady.set(id, callbacks.onReady);
				}
			}

			if (callbacks?.onStop !== undefined)
				entry.onStop.set(id, callbacks.onStop);
		}
	} else {
		_safeMaybePromise(callbacks?.onLoading?.(id));
	}

	debugMeteorSubscriptions();

	return {id, key, onReady: callbacks?.onReady, onStop: callbacks?.onStop};
};

export default subscribe;
