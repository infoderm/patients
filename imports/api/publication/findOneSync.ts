import assert from 'assert';

import {type Mongo} from 'meteor/mongo';

import fetchSync from './fetchSync';

/**
 * Synchronous cursor fetch for a single item.
 */
const findOneSync = <T, U = T>(
	collection: Mongo.Collection<T, U>,
	selector?: Mongo.Selector<T>,
	options?: Mongo.Options<T>,
): U | undefined => {
	const cursor = collection.find(selector, {...options, limit: 1});
	const items = fetchSync(cursor);
	assert(items.length <= 1);
	return items[0];
};

export default findOneSync;
