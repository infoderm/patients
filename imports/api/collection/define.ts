import assert from 'assert';

import type Document from '../Document';
import Collection from '../Collection';

import {hasCollection, addCollection} from './registry';

const define = <T extends Document, U = T>(name: string) => {
	assert(!hasCollection(name));

	const collection = new Collection<T, U>(name, {
		idGeneration: 'STRING',
		defineMutationMethods: false,
	});

	addCollection(name, collection);

	return collection;
};

export default define;
