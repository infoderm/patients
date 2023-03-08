import authorized from '../authorized';
import type Serializable from '../Serializable';

import type Args from '../Args';
import type Context from './Context';
import type Endpoint from './Endpoint';
import EndpointError from './EndpointError';

const invoke = async <A extends Args, R extends Serializable>(
	endpoint: Endpoint<A, R>,
	invocation: Partial<Context>,
	args: A,
): Promise<R> => {
	if (!authorized(endpoint.authentication, invocation)) {
		throw new EndpointError('not-authorized');
	}

	Reflect.apply(endpoint.validate, invocation, args);
	return Reflect.apply(endpoint.run, invocation, args);
};

export default invoke;
