import intersection from './intersection';
import isEmpty from './isEmpty';

type Weight = number;

export default function* add<Endpoint>(
	x0: Endpoint,
	x1: Endpoint,
	xw: Weight,
	y0: Endpoint,
	y1: Endpoint,
	xy: Weight,
): IterableIterator<[Endpoint, Endpoint, Weight]> {
	const [i0, i1] = intersection(x0, x1, y0, y1);

	if (isEmpty(i0, i1)) {
		yield [x0, x1, xw];
	} else {
		if (!isEmpty(x0, i0)) {
			yield [x0, i0, xw];
		}

		yield [i0, i1, xw + xy];

		if (!isEmpty(i1, x1)) {
			yield [i1, x1, xw];
		}
	}
}
