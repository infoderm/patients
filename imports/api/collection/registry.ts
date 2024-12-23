import assert from 'assert';

import type Document from '../Document';
import type Collection from '../Collection';

const _registry = new Map<string, Collection<any, any>>();

export const getCollection = <T extends Document, U = T>(
	name: string,
): Collection<T, U> => {
	const collection = _registry.get(name);
	assert(collection !== undefined);
	return collection;
};

export const hasCollection = (name: string) => {
	return _registry.has(name);
};

export const addCollection = <T extends Document, U = T>(
	name: string,
	collection: Collection<T, U>,
) => {
	assert(!hasCollection(name));
	_registry.set(name, collection);
};

export const removeCollection = (name: string) => {
	assert(hasCollection(name));
	_registry.delete(name);
};
