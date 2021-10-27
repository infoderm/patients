import {iter} from '@iterable-iterator/iter';
import {next, StopIteration} from '@iterable-iterator/next';
import intersection from './intersection';
import isEmpty from './isEmpty';

const nonOverlappingIntersection = function* <Endpoint>(
	slots: Iterable<[Endpoint, Endpoint]>,
	events: Iterable<[Endpoint, Endpoint]>,
): IterableIterator<[Endpoint, Endpoint]> {
	const it = iter(slots);

	let slotBegin;
	let slotEnd;

	try {
		// TODO DRY
		[slotBegin, slotEnd] = next(it);
	} catch (error: unknown) {
		if (error instanceof StopIteration) return;
		throw error;
	}

	for (let [begin, end] of events) {
		while (!isEmpty(begin, end)) {
			const [i0, i1] = intersection(slotBegin, slotEnd, begin, end);
			if (isEmpty(i0, i1)) {
				if (slotBegin <= begin) {
					try {
						[slotBegin, slotEnd] = next(it);
					} catch (error: unknown) {
						if (error instanceof StopIteration) return;
						throw error;
					}
				} else {
					break;
				}
			} else {
				yield [i0, i1];
				begin = i1;
			}
		}
	}
};

export default nonOverlappingIntersection;
