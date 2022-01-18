import {Meteor} from 'meteor/meteor';
import Endpoint from './Endpoint';

const invoke = <T>(
	endpoint: Endpoint<T>,
	invocation: Partial<Meteor.MethodThisType>,
	args: any[],
) => {
	Reflect.apply(endpoint.validate, invocation, args);
	return Reflect.apply(endpoint.run, invocation, args);
};

export default invoke;
