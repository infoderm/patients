import {assert, expect} from 'chai';

import {Meteor} from 'meteor/meteor';

import totalOrder from 'total-order';
import {sorted} from '@iterable-iterator/sorted';

import sleep from '../util/async/sleep';

import logout from '../api/user/logout';
import define from '../api/collection/define';
import {removeCollection} from '../api/collection/registry';
import invoke from '../api/endpoint/invoke';
import call from '../api/endpoint/call';
import reset from '../api/endpoint/_dev/reset';
import type Collection from '../api/Collection';
import type Document from '../api/Document';
import type Selector from '../api/query/Selector';
import appIsReady from '../app/isReady';
import isAppTest from '../app/isAppTest';
import {_router} from '../ui/Router';
import {getWatchStreamCount} from '../api/query/watch';

import {unmount as _unmount} from './react';

export {
	default as randomId,
	default as randomUserId,
	default as randomPassword,
} from '../api/randomId';

let resolving = 0;

export const waitFor = async (condition: () => boolean) => {
	while (!condition()) {
		// eslint-disable-next-line no-await-in-loop
		await sleep(50);
	}
};

export const withMockCollection =
	<T extends Document, U = T>(
		callback: (collection: Collection<T, U>) => Promise<void> | void,
	) =>
	async () => {
		const collectionName = '__mocks__';
		const collection = define<T, U>(collectionName);
		try {
			await callback(collection);
		} finally {
			await collection.dropCollectionAsync();
			removeCollection(collectionName);
		}
	};

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

const mount = isAppTest()
	? async () => {
			await _router.navigate('/');
	  }
	: // eslint-disable-next-line @typescript-eslint/no-empty-function
	  async () => {};

const unmount = isAppTest()
	? async () => {
			await _router.navigate('/_test/unmount');
	  }
	: async () => {
			_unmount();
	  };

const assertChangeStreamWatchersAreOff = () => {
	const n = getWatchStreamCount();
	if (n !== 0) {
		console.warn(`ChangeStream watch count is different from 0 (got ${n})!`);
	}
};

export const client = (title, fn) => {
	if (Meteor.isClient) {
		const cleanup = async () => {
			await logout();
			await unmount();
			assertChangeStreamWatchersAreOff();
			await mount();
			await call(reset);
		};

		let original;

		const prepare = async function () {
			this.timeout(10_000);
			// @ts-expect-error TODO
			await import('./mocha.css');

			original = await forgetHistory();
			await cleanup();
		};

		const restore = async function () {
			this.timeout(10_000);
			await cleanup();
			await rollBackHistory(original);
		};

		describe(title, function () {
			this.timeout(isAppTest() ? 15_000 : 1000);
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

		const prepare = async function () {
			this.timeout(10_000);
			if (isAppTest()) {
				await appIsReady();
			}

			await cleanup();
		};

		const restore = async function () {
			this.timeout(10_000);
			await cleanup();
		};

		describe(title, function () {
			this.timeout(isAppTest() ? 10_000 : 2000);
			beforeEach(prepare);
			fn();
			afterEach(restore);
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

export const dropIds = (x) => x.map((x) => (x === null ? null : dropId(x)));

export const dropOwner = ({owner, ...rest}) => {
	assert(typeof owner === 'string');
	return rest;
};

export const dropOwners = (x) => x.map(dropOwner);

type Created<T> = T extends {[K in keyof T]: T[K]}
	? {[K in keyof T]: Created<T[K]>}
	: T extends () => any
	? ReturnType<T>
	: never;

type Extra<T> = T extends any[]
	? Created<T>
	: T extends {[K in keyof T]: T[K]}
	? Partial<Created<T>>
	: T extends () => any
	? ReturnType<T>
	: never;

export function create<T extends () => any>(
	template: T,
	extra?: Extra<T>,
	hasExtra?: boolean,
): Created<T>;
export function create<T extends {[K in keyof T]: T[K]}>(
	template: T,
	extra?: Extra<T>,
	hasExtra?: boolean,
): Created<T>;

export function create<T>(
	template: T,
	extra?: Extra<T>,
	hasExtra?: boolean,
): Created<T> {
	if (typeof template === 'function') return hasExtra ? extra : template();
	if (Array.isArray(template)) {
		return (template as Array<T[keyof T]>)
			.map((x, i) =>
				create(
					x,
					extra?.[i],
					Object.prototype.hasOwnProperty.call(extra ?? [], i),
				),
			)
			.concat(extra?.slice(template.length) ?? []) as Created<T>;
	}

	return Object.fromEntries(
		(extra === undefined ? [] : Object.entries(extra)).concat(
			Object.entries(template as {[K in keyof T]: T[K]}).map(
				<V>([key, value]: [string, V]) => [
					key,
					create(
						value,
						extra?.[key],
						Object.prototype.hasOwnProperty.call(extra ?? {}, key),
					),
				],
			),
		),
	) as Created<T>;
}

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

export const makeTemplate = (template) => (extra?) =>
	create(template, extra, extra !== undefined);

export const isNode = () => Meteor.isServer;
