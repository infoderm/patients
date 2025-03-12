import assert from 'assert';

import {iter} from '@iterable-iterator/iter';
import {next, StopIteration} from '@iterable-iterator/next';

const simplifyUnion = function* <Endpoint>(
	intervals: Iterable<[Endpoint, Endpoint]>,
): IterableIterator<[Endpoint, Endpoint]> {
	const it = iter(intervals);
	let x0: Endpoint;
	let x1: Endpoint;
	try {
		[x0, x1] = next(it);
	} catch (error: unknown) {
		if (error instanceof StopIteration) return;
		throw error;
	}

	for (;;) {
		let y0: Endpoint;
		let y1: Endpoint;
		try {
			[y0, y1] = next(it);
		} catch (error: unknown) {
			if (error instanceof StopIteration) {
				yield [x0, x1];
				return;
			}

			throw error;
		}

		assert(x1 >= x0);
		assert(y0 >= x0);
		if (y0 > x1) {
			// x0 -- x1 -- y0 -- y1: next
			yield [x0, x1];
			x0 = y0;
			x1 = y1;
		} else if (y1 > x1) {
			// x0 -- y0 -- x1 -- y1: merge
			x1 = y1;
		}
		// else x0 -- y0 -- y1 -- x1: skip
	}
};

export default simplifyUnion;
