import {Meteor} from 'meteor/meteor';
import Params from './Params';
import Endpoint from './Endpoint';
import invoke from './invoke';

const define = <T>(params: Params<T>): Endpoint<T> => {
	Meteor.methods({
		[params.name](...args: any[]) {
			return invoke(params, this, args);
		},
	});

	return params;
};

export default define;
