// NOTE Adapted from
// https://github.com/meteor/react-packages/blob/d0645787dac675bbf5412cac0da9387b6315f5c4/packages/react-meteor-data/useTracker.ts

import assert from 'assert';

import {Meteor} from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';

import {useEffect, useMemo, type DependencyList} from 'react';

import areDeepEqual from 'react-fast-compare';

import useUniqueObject from '../../ui/hooks/useUniqueObject';

import Cursor from './Cursor';

// Warns if data is a Cursor or a POJO containing a Cursor.
function checkCursor(data: any): void {
	let shouldWarn = false;
	if (data && typeof data === 'object') {
		if (data instanceof Cursor) {
			shouldWarn = true;
		} else if (Object.getPrototypeOf(data) === Object.prototype) {
			Object.keys(data).forEach((key) => {
				if (data[key] instanceof Cursor) {
					shouldWarn = true;
				}
			});
		}
	}

	if (shouldWarn) {
		console.warn(
			'Warning: your reactive function is returning a cursor. ' +
				'This value will not be reactive. You probably want to call ' +
				'`.fetch()` on the cursor before returning it.',
		);
	}
}

export type IReactiveFn<T> = (c?: Tracker.Computation) => T;

export type ISkipUpdate<T> = (prev: T, next: T) => boolean;

const shouldNeverBeReturned = {};

const useTrackerClientImpl = <T = any>(
	reactiveFn: IReactiveFn<T>,
	deps?: DependencyList,
	skipUpdate?: ISkipUpdate<T>,
): T => {
	const [iteration, forceUpdate] = useUniqueObject();

	const data = useMemo(() => {
		let data: T = shouldNeverBeReturned as T;

		// Use Tracker.nonreactive in case we are inside a Tracker Computation.
		// This can happen if someone calls `ReactDOM.render` inside a Computation.
		// In that case, we want to opt out of the normal behavior of nested
		// Computations, where if the outer one is invalidated or stopped,
		// it stops the inner one.

		Tracker.nonreactive(() =>
			Tracker.autorun((c: Tracker.Computation) => {
				assert(c.firstRun);
				data = reactiveFn(c);
			}),
		).stop();

		return data;
	}, deps && [iteration, ...deps]);

	useEffect(() => {
		let prevData = data;

		const computation = Tracker.nonreactive(() =>
			Tracker.autorun((c: Tracker.Computation) => {
				const nextData = reactiveFn(c);
				if (
					(!c.firstRun || !areDeepEqual(prevData, nextData)) &&
					!skipUpdate?.(prevData, nextData)
				) {
					prevData = nextData;
					forceUpdate();
				}
			}),
		);

		// Stop the computation on additional renders or unmount.
		return () => {
			computation.stop();
		};
	}, deps);

	assert(data !== shouldNeverBeReturned);

	return data;
};

function useTrackerClient<T = any>(
	reactiveFn: IReactiveFn<T>,
	skipUpdate?: ISkipUpdate<T>,
): T;
function useTrackerClient<T = any>(
	reactiveFn: IReactiveFn<T>,
	deps?: DependencyList,
	skipUpdate?: ISkipUpdate<T>,
): T;
function useTrackerClient<T = any>(
	reactiveFn: IReactiveFn<T>,
	arg1?: DependencyList | ISkipUpdate<T>,
	arg2?: ISkipUpdate<T>,
): T {
	let skipUpdate: ISkipUpdate<T> | undefined;
	let deps: DependencyList | undefined;
	if (
		(arg1 === null || arg1 === undefined || !Array.isArray(arg1)) &&
		typeof arg1 === 'function'
	) {
		deps = undefined;
		skipUpdate = arg1;
	} else {
		deps = arg1;
		skipUpdate = arg2;
	}

	return useTrackerClientImpl(reactiveFn, deps, skipUpdate);
}

const useTrackerServer: typeof useTrackerClient = (reactiveFn) => {
	return Tracker.nonreactive(reactiveFn);
};

// When rendering on the server, we don't want to use the Tracker.
// We only do the first rendering on the server so we can get the data right away
const useTrackerProd = Meteor.isServer ? useTrackerServer : useTrackerClient;

function useTrackerDev(reactiveFn, deps = undefined, skipUpdate = undefined) {
	function warn(expects: string, pos: string, arg: string, type: string) {
		console.warn(
			`Warning: useTracker expected a ${expects} in it's ${pos} argument ` +
				`(${arg}), but got type of \`${type}\`.`,
		);
	}

	if (typeof reactiveFn !== 'function') {
		warn('function', '1st', 'reactiveFn', reactiveFn);
	}

	if (
		deps &&
		skipUpdate &&
		!Array.isArray(deps) &&
		typeof skipUpdate === 'function'
	) {
		warn(
			'array & function',
			'2nd and 3rd',
			'deps, skipUpdate',
			`${typeof deps} & ${typeof skipUpdate}`,
		);
	} else {
		if (deps && !Array.isArray(deps) && typeof deps !== 'function') {
			warn('array or function', '2nd', 'deps or skipUpdate', typeof deps);
		}

		if (skipUpdate && typeof skipUpdate !== 'function') {
			warn('function', '3rd', 'skipUpdate', typeof skipUpdate);
		}
	}

	const data = useTrackerProd(reactiveFn, deps, skipUpdate);
	checkCursor(data);
	return data;
}

const useTracker = Meteor.isDevelopment
	? (useTrackerDev as typeof useTrackerClient)
	: useTrackerProd;

export default useTracker;
