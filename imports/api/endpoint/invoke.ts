import {Meteor} from 'meteor/meteor';
import Endpoint from './Endpoint';

const invoke = <T>(
	endpoint: Endpoint<T>,
	invocation: Partial<Meteor.MethodThisType>,
	args: any[],
) => {
	Reflect.apply(endpoint.validate, invocation, args);
	const body = (invocation.isSimulation && endpoint.simulate) || endpoint.run;
	return Reflect.apply(body, invocation, args);
};

export default invoke;
