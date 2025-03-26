import {assert} from 'chai';

import schema from '../../util/schema';
import {isomorphic} from '../../_test/fixtures';

import type UserFilter from './UserFilter';
import {userFilter} from './UserFilter';

const _asserInvalidInput = <T>(result: schema.SafeParseReturnType<T, T>) => {
	assert.isFalse(result.success);
	assert.lengthOf(result.error.issues, 1);
	assert.strictEqual(result.error.issues[0]!.message, 'Invalid input');
};

isomorphic(__filename, () => {
	it('should work on a simple schema', () => {
		const filter: UserFilter<{name: string}> = {name: 'abcd'};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({name: schema.string()}),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work on a simple schema (NaN)', () => {
		const filter: UserFilter<{count: number}> = {count: Number.NaN};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({count: schema.number()}),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work on a schema with an optional field', () => {
		const filter: UserFilter<{name?: string}> = {name: null};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({name: schema.string().optional()}),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work on a partial object schema', () => {
		const filter: UserFilter<Partial<{name: string}>> = {name: null};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({name: schema.string()}).partial(),
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

	it('should throw an error on a schema containing an array (array `$elemMatch` filter)', () => {
		const filter: UserFilter<{relations: Array<{name: string}>}> = {
			// @ts-expect-error -- NOTE: This is on purpose for testing.
			relations: {$elemMatch: {name: 1}},
		};
		const tSchema: schema.ZodType<typeof filter> = userFilter(
			schema.object({
				relations: schema.array(schema.object({name: schema.string()})),
			}),
		);
		_asserInvalidInput(tSchema.safeParse(filter));
	});
});
