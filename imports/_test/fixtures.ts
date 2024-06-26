// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';

import {assert, expect} from 'chai';

import {cleanup as unmount} from '@testing-library/react';
import totalOrder from 'total-order';
import {sorted} from '@iterable-iterator/sorted';

import logout from '../api/user/logout';
import invoke from '../api/endpoint/invoke';
import call from '../api/endpoint/call';
import reset from '../api/endpoint/_dev/reset';
import type Collection from '../api/Collection';
import type Document from '../api/Document';
import type Selector from '../api/query/Selector';
import appIsReady from '../app/isReady';
import isAppTest from '../app/isAppTest';

export {
	default as randomId,
	default as randomUserId,
	default as randomPassword,
} from '../api/randomId';

let resolving = 0;

const resolveOnPopstate = async () =>
	new Promise<void>((resolve) => {
		let pos = ++resolving;
		const eventType = 'popstate';
		const resolver = () => {
			// NOTE
			// Order of execution is guaranteed in DOM3
			// See https://stackoverflow.com/a/16273678
			if (--pos !== 0) return;
			--resolving;
			window.removeEventListener(eventType, resolver);
			resolve();
		};

		window.addEventListener(eventType, resolver);
	});

export const historyBack = async () => {
	const promise = resolveOnPopstate();
	history.back();
	return promise;
};

const historyGo = async (n: number) => {
	const promise = resolveOnPopstate();
	history.go(n);
	return promise;
};

const rollBackHistory = async (to: number) => {
	const current = await forgetHistory();
	if (to < current) {
		const steps = current - to;
		console.debug({
			location: location.href,
			history: history.length,
			steps,
		});
		await historyGo(-steps);
	}
};

const pushDummyState = () => {
	history.pushState(null, '');
};

const forgetHistory = async () => {
	pushDummyState();
	await historyBack();
	return history.length - 1;
};

export const client = (title, fn) => {
	if (Meteor.isClient) {
		const cleanup = async () => {
			await logout();
			unmount();
			await call(reset);
		};

		let original;

		const prepare = async () => {
			await import('../../client/polyfill');

			original = await forgetHistory();
			await cleanup();
		};

		const restore = async () => {
			await cleanup();
			await rollBackHistory(original);
		};

		describe(title, function () {
			this.timeout(15_000);
			beforeEach(prepare);
			fn();
			afterEach(restore);
		});
	}
};

export const server = (title, fn) => {
	if (Meteor.isServer) {
		const cleanup = async () => {
			await invoke(reset, {userId: null}, []);
		};

		const prepare = async () => {
			await import('../../server/polyfill');

			if (isAppTest()) {
				await appIsReady();
			}

			await cleanup();
		};

		describe(title, function () {
			if (isAppTest()) {
				this.timeout(10_000);
			}

			beforeEach(prepare);
			fn();
			afterEach(cleanup);
		});
	}
};

export const isomorphic = (title, fn) => {
	client(title, fn);
	server(title, fn);
};

export const throws = async (
	fn: () => Promise<any>,
	expected: string | RegExp,
) => {
	let thrownError: any;
	try {
		await fn();
	} catch (error: unknown) {
		thrownError = error;
	}

	assert.notEqual(thrownError, undefined, 'Expected error to be thrown.');
	assert.instanceOf(
		thrownError,
		Error,
		'Expected thrown error to be an instance of Error.',
	);
	if (typeof expected === 'string') {
		expect(thrownError.message).to.equal(expected);
	} else if (expected instanceof RegExp) {
		expect(thrownError.message).to.match(expected);
	}
};

export const setLike = (x) => sorted(totalOrder, x);

export const dropId = ({_id, ...rest}) => {
	assert(typeof _id === 'string');
	return rest;
};

export const dropIds = (x) => x.map(dropId);

export const create = (template, extra) => {
	if (typeof template === 'function') return extra ?? template();
	if (Array.isArray(template)) {
		return template
			.map((x, i) => create(x, extra?.[i]))
			.concat(extra?.slice(template.length) ?? []);
	}

	return Object.fromEntries(
		(extra === undefined ? [] : Object.entries(extra)).concat(
			Object.entries(template).map(([key, value]) => [
				key,
				create(value, extra?.[key]),
			]),
		),
	);
};

export const findOneOrThrow = async <T extends Document, U = T>(
	collection: Collection<T, U>,
	selector: string | Selector<T> = {},
) => {
	const result = await collection.findOneAsync(selector);
	if (result === undefined) {
		throw new Error('findOneOrThrow returned undefined');
	}

	return result!;
};

export const makeTemplate = (template) => (extra?) => create(template, extra);
