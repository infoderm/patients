import type Document from '../Document';
import Collection from '../Collection';

const define = <T extends Document, U = T>(name: string) => {
	return new Collection<T, U>(name, {
		idGeneration: 'STRING',
		defineMutationMethods: false,
	});
};

export default define;
