import authorized from '../authorized';
import {type Authentication} from '../Authentication';
import type Serializable from '../Serializable';

import type Args from '../Args';
import type ContextFor from './ContextFor';
import type Endpoint from './Endpoint';
import EndpointError from './EndpointError';

const invoke = async <
	A extends Args,
	R extends Serializable,
	Auth extends Authentication,
	C extends ContextFor<Auth>,
>(
	endpoint: Endpoint<A, R, Auth, C>,
	invocation: C,
	args: A,
): Promise<R> => {
	if (!authorized(endpoint.authentication, invocation)) {
		throw new EndpointError('not-authorized');
	}

	Reflect.apply(endpoint.validate, invocation, args);
	return Reflect.apply(endpoint.run, invocation, args);
};

export default invoke;
