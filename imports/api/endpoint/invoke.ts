import {Meteor} from 'meteor/meteor';
import authorized from '../authorized';

import type Args from '../Args';
import type Context from './Context';
import type Endpoint from './Endpoint';

const EndpointError = Meteor.Error;

const invoke = async <A extends Args, R>(
	endpoint: Endpoint<A, R>,
	invocation: Partial<Context>,
	args: A,
): Promise<R | undefined> => {
	if (!authorized(endpoint.authentication, invocation)) {
		throw new EndpointError('not-authorized');
	}

	Reflect.apply(endpoint.validate, invocation, args);
	return Reflect.apply(endpoint.run, invocation, args);
};

export default invoke;
