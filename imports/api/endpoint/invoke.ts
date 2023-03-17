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

	let parsedArgs: A;

	try {
		endpoint.schema.parse(args);
		parsedArgs = args; // TODO Use parsed value once it does not reorder object keys.
	} catch (error: unknown) {
		console.debug({endpoint: endpoint.name, args, error});
		throw new EndpointError('schema validation of endpoint args failed');
	}

	if (endpoint.validate) {
		Reflect.apply(endpoint.validate, invocation, parsedArgs);
	}

	return Reflect.apply(endpoint.run, invocation, parsedArgs);
};

export default invoke;
