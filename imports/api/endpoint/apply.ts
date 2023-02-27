import _apply from '../_apply';

import type Args from '../Args';
import type Endpoint from './Endpoint';
import type Options from './Options';

const apply = async <A extends Args, R>(
	endpoint: Endpoint<A, R>,
	args: A,
	callOptions?: Options<R>,
): Promise<R> => {
	const options = {
		...endpoint.options,
		...callOptions,
	};
	return _apply<R>(endpoint.name, args, options);
};

export default apply;
