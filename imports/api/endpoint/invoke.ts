import {Meteor} from 'meteor/meteor';
import Endpoint from './Endpoint';

const authorized = <T>(
	endpoint: Endpoint<T>,
	invocation: Partial<Meteor.MethodThisType>,
): boolean => {
	switch (endpoint.authentication) {
		case 'DANGEROUS-NONE':
			return true;
		case 'logged-in':
			return typeof invocation.userId === 'string' && invocation.userId !== '';
		default:
			return false;
	}
};

const invoke = <T>(
	endpoint: Endpoint<T>,
	invocation: Partial<Meteor.MethodThisType>,
	args: any[],
) => {
	if (!authorized(endpoint, invocation)) {
		throw new Meteor.Error('not-authorized');
	}

	Reflect.apply(endpoint.validate, invocation, args);
	return Reflect.apply(endpoint.run, invocation, args);
};

export default invoke;
