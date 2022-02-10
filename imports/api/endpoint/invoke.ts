import {Meteor} from 'meteor/meteor';
import authorized from '../authorized';
import Endpoint from './Endpoint';

const invoke = async <R>(
	endpoint: Endpoint<R>,
	invocation: Partial<Meteor.MethodThisType>,
	args: any[],
): Promise<R> => {
	// TODO return-type should be Promise<R> | R | void but that breaks
	// everything. Perhaps should have endpoint.run and enpoint.simulate as
	// separate. Have a specialized serverInvoke and clientInvoke functions?
	if (!authorized(endpoint.authentication, invocation)) {
		throw new Meteor.Error('not-authorized');
	}

	Reflect.apply(endpoint.validate, invocation, args);
	return Reflect.apply(endpoint.run, invocation, args);
};

export default invoke;
