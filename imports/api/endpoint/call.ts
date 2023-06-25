import _apply from '../_apply';

import type Args from '../Args';
import type Serializable from '../Serializable';
import {type Authentication} from '../Authentication';

import type Endpoint from './Endpoint';

const call = async <
	A extends Args,
	R extends Serializable,
	Auth extends Authentication,
>(
	endpoint: Endpoint<A, R, Auth>,
	...args: A
): Promise<R> => _apply<R>(endpoint.name, args, endpoint.options);

export default call;
