import _apply from '../_apply';

import type Args from '../Args';
import {type Authentication} from '../Authentication';
import type Serializable from '../Serializable';

import type Endpoint from './Endpoint';
import type Options from './Options';

const apply = async <
	A extends Args,
	R extends Serializable,
	Auth extends Authentication,
>(
	endpoint: Endpoint<A, R, Auth>,
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
