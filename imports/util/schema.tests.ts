import {assert} from 'chai';

import {isomorphic} from '../_test/fixtures';

import schema, {at} from './schema';

const _asserInvalidInput = <T>(
	result: schema.SafeParseReturnType<T, T>,
	messages: string[] = ['Invalid input'],
) => {
	assert.isFalse(result.success);
	assert.deepEqual(
		result.error.issues.map(({message}) => message),
		messages,
	);
};

isomorphic(__filename, () => {
	it('`at` should work', () => {
		const expected = schema.string();
		assert.strictEqual(
			at(schema.object({name: expected}), schema.literal('name')),
			expected,
		);
	});

	it('`at` should work on intersections', () => {
		const tSchema = at(
			schema.intersection(
				schema.object({count: schema.number()}),
				schema.object({name: schema.string()}),
			),
			schema.literal('name'),
		);

		assert.deepEqual(tSchema.parse('test'), 'test');
	});

	it('`at` should work on unions', () => {
		const tSchema = at(
			schema.union([
				schema.object({count: schema.number()}),
				schema.object({name: schema.string()}),
			]),
			schema.literal('name'),
		);

		assert.deepEqual(tSchema.parse('test'), 'test');
	});

	it('`at` should work on intersections of unions', () => {
		const tSchema = at(
			schema.intersection(
				schema.object({count: schema.number()}),
				schema.union([
					schema.object({name: schema.undefined()}),
					schema.object({name: schema.string()}),
				]),
			),
			schema.literal('name'),
		);

		assert.deepEqual(
			[tSchema.parse('test'), tSchema.parse(undefined)],
			['test', undefined],
		);
	});

	it('`at` should work on intersections of unions (strict)', () => {
		const tSchema = at(
			schema.intersection(
				schema.object({count: schema.number()}).strict(),
				schema.union([
					schema.object({name: schema.undefined()}).strict(),
					schema.object({name: schema.string()}).strict(),
				]),
			),
			schema.literal('name'),
		);

		assert.deepEqual(
			[tSchema.parse('test'), tSchema.parse(undefined)],
			['test', undefined],
		);
	});

	it('`at` should work on intersections of unions (never)', () => {
		const tSchema = at(
			schema.intersection(
				schema.object({name: schema.never()}),
				schema.union([
					schema.object({name: schema.undefined()}),
					schema.object({name: schema.string()}),
				]),
			),
			schema.literal('name'),
		);

		_asserInvalidInput(tSchema.safeParse('test'), [
			'Expected never, received string',
		]);
	});
});
