import {assert} from 'chai';

import {isomorphic} from '../_test/fixtures';

import schema, {at, keyof, partial, toJSON} from './schema';

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

	it('`at` should throw on non-implemented types', () => {
		assert.throws(
			() => at(schema.string(), schema.number()),
			'Not implemented: at(ZodString, ZodNumber)',
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

	it('`keyof` should throw on non-implemented types', () => {
		assert.throws(
			() => keyof(schema.string()),
			'Not implemented: keyof(ZodString)',
		);
	});

	it('`keyof` should work on intersections of unions', () => {
		const tSchema = keyof(
			schema.intersection(
				schema.object({count: schema.number()}),
				schema.union([
					schema.object({name: schema.undefined()}),
					schema.object({name: schema.string()}),
				]),
			),
		);

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				typeName: 'ZodEnum',
				values: ['count', 'name'],
			},
		});
	});

	it('`partial` should throw on non-implemented types', () => {
		assert.throws(
			() => partial(schema.string()),
			'Not implemented: partial(ZodString)',
		);
	});

	it('`partial` should work on objects', () => {
		const tSchema = partial(schema.object({count: schema.number()}));

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			def: {
				catchall: {
					_def: {
						typeName: 'ZodNever',
					},
				},
				typeName: 'ZodObject',
				unknownKeys: 'strip',
			},
			shape: {
				count: {
					_def: {
						options: [
							{
								_def: {
									checks: [],
									coerce: false,
									typeName: 'ZodNumber',
								},
							},
							{
								_def: {
									typeName: 'ZodUndefined',
								},
							},
						],
						typeName: 'ZodUnion',
					},
				},
			},
		});
	});
});
