import assert from 'assert';
import type Collection from '../Collection';
import type Document from '../Document';
import type Options from '../QueryOptions';
import type Selector from '../QuerySelector';

import fetchSync from './fetchSync';

/**
 * Synchronous cursor fetch for a single item.
 */
const findOneSync = <T extends Document, U = T>(
	collection: Collection<T, U>,
	selector?: Selector<T>,
	options?: Options<T>,
): U | undefined => {
	const cursor = collection.find(selector, {...options, limit: 1});
	const items = fetchSync(cursor);
	assert(items.length <= 1);
	return items[0];
};

export default findOneSync;
