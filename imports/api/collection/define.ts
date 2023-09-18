import type Document from '../Document';
import Collection from '../Collection';

const define = <T extends Document, U = T>(name: string) => {
	return new Collection<T, U>(name, {
		idGeneration: 'STRING',
		defineMutationMethods: false,
		// @ts-expect-error This is not part of the public API.
		_suppressSameNameError: Boolean(Meteor.isTest || Meteor.isAppTest),
	});
};

export default define;
