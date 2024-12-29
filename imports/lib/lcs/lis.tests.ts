import {assert} from 'chai';

import {isomorphic} from '../../_test/fixtures';

import {lis} from './lis';

isomorphic(__filename, () => {
	it('should work on an empty input', () => {
		const p = [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15];
		const subsequence = lis(0, p);
		assert.deepEqual(subsequence.length, 0);
	});

	it('should work on the identity', () => {
		const p = [0, 1, 2, 3, 4, 5];
		assert.deepEqual(lis(p.length, p), [0, 1, 2, 3, 4, 5]);
	});

	it('should work with negative values', () => {
		const p = [-5, -4, -3, -2, -1];
		assert.deepEqual(lis(p.length, p), [0, 1, 2, 3, 4]);
	});

	it('should work with negative and positive values', () => {
		const p = [-5, 2, -3, 4, -1, 6, 7];
		const subsequence = lis(p.length, p);
		assert.deepEqual(subsequence.length, 5);
	});

	it('should work on length-1 input', () => {
		const p = [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15];
		const subsequence = lis(1, p);
		assert.deepEqual(subsequence.length, 1);
	});

	it('should work on length-2 input', () => {
		const p = [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15];
		const subsequence = lis(2, p);
		assert.deepEqual(subsequence.length, 2);
	});

	it('should work on length-3 input', () => {
		const p = [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15];
		const subsequence = lis(3, p);
		assert.deepEqual(subsequence.length, 2);
	});

	it('should work on length-4 input', () => {
		const p = [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15];
		const subsequence = lis(4, p);
		assert.deepEqual(subsequence.length, 3);
	});

	it('should work on length-5 input', () => {
		const p = [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15];
		const subsequence = lis(5, p);
		assert.deepEqual(subsequence.length, 3);
	});

	it('should work on length-6 input', () => {
		const p = [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15];
		const subsequence = lis(6, p);
		assert.deepEqual(subsequence.length, 3);
	});

	it('should work on length-7 input', () => {
		const p = [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15];
		const subsequence = lis(7, p);
		assert.deepEqual(subsequence.length, 3);
	});

	it('should work on length-8 input', () => {
		const p = [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15];
		const subsequence = lis(8, p);
		assert.deepEqual(subsequence.length, 4);
	});

	it('should work on length-9 input', () => {
		const p = [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15];
		const subsequence = lis(9, p);
		assert.deepEqual(subsequence.length, 4);
	});

	it('should work on a Van der Corput sequence', () => {
		const p = [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15];
		const subsequence = lis(p.length, p);
		assert.deepEqual(subsequence.length, 6);
	});
});
