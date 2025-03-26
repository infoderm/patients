import {assert} from 'chai';

import schema from '../../util/schema';
import {isomorphic} from '../../_test/fixtures';

import type ServerFilter from './Filter';
import {filter as serverFilter} from './Filter';

const _asserInvalidInput = <T>(result: schema.SafeParseReturnType<T, T>) => {
	assert.isFalse(result.success);
	assert.lengthOf(result.error.issues, 1);
	assert.strictEqual(result.error.issues[0]!.message, 'Invalid input');
};

isomorphic(__filename, () => {
	it('should work with $where (string)', () => {
		const filter: ServerFilter<{name: string}> = {
			$where: 'function() { return this.name !== undefined; }',
		};
		const tSchema: schema.ZodType<typeof filter> = serverFilter(
			schema.object({name: schema.string()}),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should work with $where (function)', () => {
		const filter: ServerFilter<{name: string}> = {
			$where() {
				return this.name !== '';
			},
		};
		const tSchema: schema.ZodType<typeof filter> = serverFilter(
			schema.object({name: schema.string()}),
		);
		assert.deepEqual(tSchema.parse(filter), filter);
	});

	it('should throw an error with $where', () => {
		// @ts-expect-error -- NOTE: This is on purpose for testing.
		const filter: ServerFilter<{name: string}> = {$where: true};
		const tSchema: schema.ZodType<typeof filter> = serverFilter(
			schema.object({name: schema.string()}),
		);
		_asserInvalidInput(tSchema.safeParse(filter));
	});
});
