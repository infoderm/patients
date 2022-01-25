import {Meteor} from 'meteor/meteor';
import authorized from '../authorized';
import Endpoint from './Endpoint';

const invoke = <T>(
	endpoint: Endpoint<T>,
	invocation: Partial<Meteor.MethodThisType>,
	args: any[],
) => {
	if (!authorized(endpoint.authentication, invocation)) {
		throw new Meteor.Error('not-authorized');
	}

	Reflect.apply(endpoint.validate, invocation, args);
	return Reflect.apply(endpoint.run, invocation, args);
};

export default invoke;
