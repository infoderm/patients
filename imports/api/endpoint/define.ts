import {Meteor} from 'meteor/meteor';
import Params from './Params';
import Endpoint from './Endpoint';

const define = <T>(params: Params<T>): Endpoint<T> => {
	Meteor.methods({
		[params.name](...args: any[]) {
			Reflect.apply(params.validate, this, args);
			const body = (this.isSimulation && params.simulate) || params.run;
			return Reflect.apply(body, this, args);
		},
	});

	return params;
};

export default define;
