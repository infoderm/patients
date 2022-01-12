import {expect} from 'chai';

import totalOrder from 'total-order';
import {sorted} from '@iterable-iterator/sorted';

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

export const create = (template) => {
	if (typeof template === 'function') return template();
	if (Array.isArray(template)) return template.map((x) => create(x));
	return Object.fromEntries(
		Object.entries(template).map(([key, value]) => [key, create(value)]),
	);
};

export const makeTemplate = (template) => () => create(template);
