import assert from 'assert';

type Sequence = {
	[i: number]: number;
	length: number;
};

export const lis = (n: number, sequence: Sequence) => {
	assert(n <= sequence.length);

	// NOTE: Early return.
	if (n <= 0) return [];

	// NOTE: Longest Increasing Subsequence in time O(N min(|LIS|, N-|LIS|)).

	// NOTE: Length of LIS found so far (>= 1 for a non-empty sequence).
	let len = 1;

	// NOTE: Invariant:
	//   The last element of the revlex-minimum length-j increasing subsequence
	//   of sequence[:i+1] is sequence[ends[j]],
	//   for all 0 <= i < n and 0 <= j <= len.
	//
	// NOTE:
	//  Corrolary: ends[j] < ends[j+1], for all 0 <= j < len.
	const ends = new Int32Array(n + 1);
	ends[0] = -1; // NOTE: The empty sequence.
	assert(ends[1] === 0); // NOTE: Int32Array's are 0-initialized.

	// NOTE: Invariant:
	//   The LIS ending with sequence[i] extends the LIS ending with sequence[prev[i]],
	//   or the empty sequence if prev[i] is -1.
	const prev = new Int32Array(n);
	prev[0] = -1;

	for (let i = 1; i < n; ++i) {
		const k = sequence[i]!;
		assert(len >= 1);
		let j = len;

		// NOTE: Extend the longest possible increasing subsequence of sequence[:i]
		// that can be extended with sequence[i]. The extended subsequence has length j + 1.
		while (sequence[ends[j]!]! >= k && --j !== 0);
		// NOTE: Could implement binary search on j.
		// The whole algorithm would be O(N log N) in this case.

		assert(j >= 0);
		assert(j <= len);
		assert(j < n);
		prev[i] = ends[j]!;
		ends[j + 1] = i; // NOTE: prev[ends[j+1]] = ends[j]

		// NOTE: If j = len, then we found the longest increasing subsequence so far.
		// Otherwise, j < len, and we have replaced the (existing and unique) increasing
		// subsequence such that the new one comes before in revlex order.
		// TODO: Go branch-less.
		if (j === len) ++len;
	}

	// NOTE: Populate output array by walking the LIS backwards, then reversing it.
	assert(len >= 1);
	let l = ends[len]!;
	assert(l >= 0);
	const subsequence: number[] = [l];
	l = prev[l]!;
	while (l !== -1) {
		subsequence.push(l);
		l = prev[l]!;
	}

	return subsequence.reverse();
};
