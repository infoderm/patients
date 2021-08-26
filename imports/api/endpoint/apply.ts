import _apply from '../_apply';

import Endpoint from './Endpoint';
import Options from './Options';

const apply = async <T>(
	endpoint: Endpoint<T>,
	args: any[],
	callOptions?: Options<T>,
) => {
	const options = {
		...endpoint.options,
		...callOptions,
	};
	return _apply(endpoint.name, args, options);
};

export default apply;
