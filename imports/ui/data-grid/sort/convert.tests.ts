import {assert} from 'chai';

import {client} from '../../../_test/fixtures';

import {toQuerySort} from './convert';

client(__filename, () => {
	it('should work with empty sorting model', () => {
		assert.deepEqual(toQuerySort([]), undefined);
	});

	it('should work with length-1 sorting model', () => {
		assert.deepEqual(
			toQuerySort([
				{
					field: 'a',
					sort: 'asc',
				},
			]),
			{
				a: 1,
			},
		);
	});

	it('should work with length-2 sorting model', () => {
		assert.deepEqual(
			toQuerySort([
				{
					field: 'a',
					sort: 'asc',
				},
				{
					field: 'b',
					sort: 'desc',
				},
			]),
			{
				a: 1,
				b: -1,
			},
		);
	});
});
