import {assert} from 'chai';

import {isomorphic} from '../../_test/fixtures';

import unique from './unique';

isomorphic(__filename, () => {
	it('should return nothing on input without duplicates', () => {
		const expected = Array.from('abcd');
		const actual = Array.from(unique('abcd'));
		assert.deepEqual(actual, expected);
	});

	it('should work on empty inputs', () => {
		const expected = [];
		const actual = Array.from(unique([]));
		assert.deepEqual(actual, expected);
	});

	it('should work', () => {
		const expected = Array.from('abrcd');
		const actual = Array.from(unique('abracadabra'));
		assert.deepEqual(actual, expected);
	});
});
