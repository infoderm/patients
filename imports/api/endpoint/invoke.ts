import {Meteor} from 'meteor/meteor';
import authorized from '../authorized';

import type Arg from './Arg';
import type Endpoint from './Endpoint';

const invoke = async <A extends Arg[], R>(
	endpoint: Endpoint<A, R>,
	invocation: Partial<Meteor.MethodThisType>,
	args: A,
): Promise<R | undefined> => {
	if (!authorized(endpoint.authentication, invocation)) {
		throw new Meteor.Error('not-authorized');
	}

	Reflect.apply(endpoint.validate, invocation, args);
	return Reflect.apply(endpoint.run, invocation, args);
};

export default invoke;
