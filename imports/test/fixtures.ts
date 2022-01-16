import {assert, expect} from 'chai';

import {Random} from 'meteor/random';
import {cleanup as unmount} from '@testing-library/react';
import totalOrder from 'total-order';
import {sorted} from '@iterable-iterator/sorted';
import logout from '../api/user/logout';
import invoke from '../api/endpoint/invoke';
import call from '../api/endpoint/call';
import reset from '../api/endpoint/testing/reset';

export const randomUserId = () => Random.id();
export const randomPassword = () => Random.id();

export const client = (title, fn) => {
	if (Meteor.isClient) {
		const cleanup = async () => {
			await logout();
			unmount();
			await call(reset);
		};

		const prepare = cleanup;

		describe(title, () => {
			beforeEach(prepare);
			afterEach(cleanup);
			fn();
		});
	}
};

export const server = (title, fn) => {
	if (Meteor.isServer) {
		const cleanup = async () => {
			await invoke(reset, {}, []);
		};

		const prepare = cleanup;

		describe(title, () => {
			beforeEach(prepare);
			afterEach(cleanup);
			fn();
		});
	}
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
		(extra === undefined || extra === undefined
			? []
			: Object.entries(extra)
		).concat(
			Object.entries(template).map(([key, value]) => [
				key,
				create(value, extra?.[key]),
			]),
		),
	);
};

export const makeTemplate = (template) => (extra?) => create(template, extra);
