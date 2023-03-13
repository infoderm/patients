import {increasing} from '@total-order/primitive';
import nonOverlappingIntersection from './nonOverlappingIntersection';

const beginKey = (interval) => interval[0];
const endKey = (interval) => interval[1];
// TODO use @total-order/key and swap query
const asym = (compare, leftKey, rightKey) => (a, b) =>
	compare(leftKey(a), rightKey(b));

// TODO replace by @algorithm/bisect
const successor = (compare, a, l, r, x): number => {
	for (let i = l; i < r; ++i) {
		if (compare(a[i], x) > 0) return i;
	}

	return r;
};

// TODO replace by @algorithm/bisect
const predecessor = (compare, a, l, r, x): number => {
	for (let i = r; i > l; ) {
		if (compare(a[--i], x) < 0) return i;
	}

	return l - 1;
};

// TODO use @array-like/slice
const islice = function* <Endpoint>(
	data: Array<[Endpoint, Endpoint]>,
	left: number,
	right: number,
): IterableIterator<[Endpoint, Endpoint]> {
	for (let i = left; i < right; ++i) yield data[i]!;
};

const nonOverlappingIntersectionQuery = <Endpoint>(
	data: Array<[Endpoint, Endpoint]>,
	query: [Endpoint, Endpoint],
): IterableIterator<[Endpoint, Endpoint]> => {
	// The first that ends strictly after I begin
	const left = successor(
		asym(increasing, endKey, beginKey),
		data,
		0,
		data.length,
		query,
	);
	// The last that begins strictly before I end
	const right = predecessor(
		asym(increasing, beginKey, endKey),
		data,
		0,
		data.length,
		query,
	);

	// TODO shortcut a lot of logic, only left and right need intersection,
	// intermediate results are whole. Be careful as left and right could be
	// the same!
	return nonOverlappingIntersection(islice(data, left, right + 1), [query]);
};

export default nonOverlappingIntersectionQuery;
