import _apply from '../_apply';

import type Endpoint from './Endpoint';
import type Options from './Options';

const apply = async <R>(
	endpoint: Endpoint<R>,
	args: any[],
	callOptions?: Options<R>,
): Promise<R> => {
	const options = {
		...endpoint.options,
		...callOptions,
	};
	return _apply<R>(endpoint.name, args, options);
};

export default apply;
