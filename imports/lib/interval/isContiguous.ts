import {window} from '@iterable-iterator/window';

type Comparator<Endpoint> = (x: Endpoint, y: Endpoint) => boolean;

const isContiguous = <Endpoint>(
	eq: Comparator<Endpoint>,
	slots: Array<[Endpoint, Endpoint]>,
): boolean => {
	for (const [left, right] of window(2, slots)) {
		const [, end] = left;
		const [begin] = right;
		if (!eq(end, begin)) return false;
	}

	return true;
};

export default isContiguous;
