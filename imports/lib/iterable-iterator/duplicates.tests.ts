import {assert} from 'chai';

import {isomorphic} from '../../_test/fixtures';

import duplicates from './duplicates';

isomorphic(__filename, () => {
	it('should return nothing on input without duplicates', () => {
		const expected = Array.from('');
		const actual = Array.from(duplicates('abcd'));
		assert.deepEqual(actual, expected);
	});

	it('should work on empty inputs', () => {
		const expected = [];
		const actual = Array.from(duplicates([]));
		assert.deepEqual(actual, expected);
	});

	it('should work', () => {
		const expected = Array.from('aaabra');
		const actual = Array.from(duplicates('abracadabra'));
		assert.deepEqual(actual, expected);
	});
});
