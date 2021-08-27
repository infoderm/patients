import {Meteor} from 'meteor/meteor';
import Params from './Params';
import Endpoint from './Endpoint';

const define = <T>(params: Params<T>): Endpoint<T> => {
	Meteor.methods({
		[params.name](...args: any[]) {
			Reflect.apply(params.validate, this, args);
			return Meteor.isServer
				? Reflect.apply(params.run, this, args)
				: Reflect.apply(params.simulate ?? params.run, this, args);
		},
	});

	return params;
};

export default define;
