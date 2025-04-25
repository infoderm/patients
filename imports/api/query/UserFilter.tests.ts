import {assert} from 'chai';

import schema from '../../util/schema';
import {isomorphic} from '../../_test/fixtures';

import type UserFilter from './UserFilter';
import {userFilter} from './UserFilter';

const _asserInvalidInput = <T>(
	result: schema.SafeParseReturnType<T, T>,
	message = 'Invalid input',
) => {
	assert.isFalse(result.success);
	assert.lengthOf(result.error.issues, 1);
	assert.strictEqual(result.error.issues[0]!.message, message);
};

isomorphic(__filename, () => {
	it('should work on a simple schema', () => {
		const filter: UserFilter<{count: number; name: string}> = {
			count: 1,
			name: 'abcd',
		};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({count: schema.number(), name: schema.string()}),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work on a simple schema (number - NaN)', () => {
		const filter: UserFilter<{count: number}> = {count: Number.NaN};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({count: schema.number()}),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work on a simple schema (string - RegExp)', () => {
		const filter: UserFilter<{name: string}> = {name: /abcd/};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({name: schema.string()}),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work on a schema with an optional field ({})', () => {
		const filter: UserFilter<{name?: string}> = {};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({name: schema.string().optional()}),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work on a partial object schema ({})', () => {
		const filter: UserFilter<Partial<{name: string}>> = {};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({name: schema.string()}).partial(),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work on a schema with an optional field (undefined)', () => {
		const filter: UserFilter<{name?: string}> = {name: undefined};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({name: schema.string().optional()}),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work on a partial object schema (undefined)', () => {
		const filter: UserFilter<Partial<{name: string}>> = {name: undefined};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({name: schema.string()}).partial(),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work on a schema with an optional field (null)', () => {
		const filter: UserFilter<{name?: string}> = {name: null};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({name: schema.string().optional()}),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work on a partial object schema (null)', () => {
		const filter: UserFilter<Partial<{name: string}>> = {name: null};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({name: schema.string()}).partial(),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work on a union of strict object schemas', () => {
		const filter: UserFilter<{name: undefined} | {name: string}> = {
			name: {$regex: 'a'},
		};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.union([
				schema.object({name: schema.undefined()}).strict(),
				schema.object({name: schema.string()}).strict(),
			]),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work on an intersection of object schemas', () => {
		const filter: UserFilter<{count: number} & {name: string}> = {
			count: 1,
			name: 'a',
		};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.intersection(
				schema.object({count: schema.number()}).strict(),
				schema.object({name: schema.string()}).strict(),
			),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work on an intersection of object schemas ($regex)', () => {
		const filter: UserFilter<{count: number} & {name: string}> = {
			count: 1,
			name: {$regex: 'a'},
		};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.intersection(
				schema.object({count: schema.number()}).strict(),
				schema.object({name: schema.string()}).strict(),
			),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work on a union of strict object schemas ($and)', () => {
		const filter: UserFilter<{count: number} | {name: string}> = {
			$and: [{count: 1}, {name: {$regex: 'a'}}],
		};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.union([
				schema.object({count: schema.number()}).strict(),
				schema.object({name: schema.string()}).strict(),
			]),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work on an intersection of object schemas ($and)', () => {
		const filter: UserFilter<{count: number} & {name: string}> = {
			$and: [{count: 1}, {name: {$regex: 'a'}}],
		};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.intersection(
				schema.object({count: schema.number()}).strict(),
				schema.object({name: schema.string()}).strict(),
			),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work on an intersection of unions of object schemas ($and)', () => {
		const filter: UserFilter<
			{count: number} & ({name: undefined} | {name: string})
		> = {
			$and: [{count: 1}, {name: {$regex: 'a'}}],
		};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.intersection(
				schema.object({count: schema.number()}),
				schema.union([
					schema.object({name: schema.undefined()}),
					schema.object({name: schema.string()}),
				]),
			),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work on an intersection of unions of object schemas with arrays ($and)', () => {
		const filter: UserFilter<
			{count: number} & ({users: undefined} | {users: Array<{name: string}>})
		> = {
			$and: [{count: 1}, {users: {$elemMatch: {name: {$regex: 'a'}}}}],
		};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.intersection(
				schema.object({count: schema.number()}),
				schema.union([
					schema.object({users: schema.undefined()}),
					schema.object({
						users: schema.array(schema.object({name: schema.string()})),
					}),
				]),
			),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work on a schema containing an array (single value filter)', () => {
		const filter: UserFilter<{name: string[]}> = {name: 'abcd'};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({name: schema.array(schema.string())}),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work on a schema containing an array (array filter)', () => {
		const filter: UserFilter<{name: string[]}> = {name: ['abcd']};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({name: schema.array(schema.string())}),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work on a schema containing an array (array `$elemMatch` filter)', () => {
		const filter: UserFilter<{relations: Array<{name: string}>}> = {
			relations: {$elemMatch: {name: 'abcd'}},
		};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({
				relations: schema.array(schema.object({name: schema.string()})),
			}),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should throw error on a simple schema', () => {
		// @ts-expect-error -- NOTE: This is on purpose for testing.
		const filter: UserFilter<{name: string}> = {name: 1};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({name: schema.string()}),
		);
		_asserInvalidInput(tSchema.safeParse(filter));
	});

	it('should throw error on unknown keys', () => {
		// @ts-expect-error -- NOTE: This is on purpose for testing.
		const filter: UserFilter<{}> = {count: 1};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({}),
		);
		_asserInvalidInput(
			tSchema.safeParse(filter),
			"Unrecognized key(s) in object: 'count'",
		);
	});

	it('should throw error on unknown keys (strict)', () => {
		// @ts-expect-error -- NOTE: This is on purpose for testing.
		const filter: UserFilter<{}> = {count: 1};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({}).strict(),
		);
		_asserInvalidInput(
			tSchema.safeParse(filter),
			"Unrecognized key(s) in object: 'count'",
		);
	});

	it('should throw error on a simple schema (null)', () => {
		// @ts-expect-error -- NOTE: This is on purpose for testing.
		const filter: UserFilter<{name: string}> = {name: null};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({name: schema.string()}),
		);
		_asserInvalidInput(tSchema.safeParse(filter));
	});

	it('should throw an error on a schema containing an array (single value filter)', () => {
		// @ts-expect-error -- NOTE: This is on purpose for testing.
		const filter: UserFilter<{name: string[]}> = {name: 1};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({name: schema.array(schema.string())}),
		);
		_asserInvalidInput(tSchema.safeParse(filter));
	});

	it('should throw an error on a schema containing an array (array filter)', () => {
		// @ts-expect-error -- NOTE: This is on purpose for testing.
		const filter: UserFilter<{name: string[]}> = {name: [1]};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({name: schema.array(schema.string())}),
		);
		_asserInvalidInput(tSchema.safeParse(filter));
	});

	it('should throw an error on a schema containing an array of objects (array `$elemMatch` filter)', () => {
		const filter: UserFilter<{relations: Array<{name: string}>}> = {
			// @ts-expect-error -- NOTE: This is on purpose for testing.
			relations: {$elemMatch: {name: 1}},
		};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({
				relations: schema.array(schema.object({name: schema.string()})),
			}),
		);
		_asserInvalidInput(
			tSchema.safeParse(filter),
			"Unrecognized key(s) in object: '$elemMatch'",
		);
	});

	it('should throw an error on a schema containing an array of strings (array `$elemMatch` filter)', () => {
		const filter: UserFilter<{relations: string[]}> = {
			// @ts-expect-error -- NOTE: This is on purpose for testing.
			relations: {$elemMatch: {name: ''}},
		};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({
				relations: schema.array(schema.string()),
			}),
		);
		_asserInvalidInput(
			tSchema.safeParse(filter),
			"Unrecognized key(s) in object: '$elemMatch'",
		);
	});
});
