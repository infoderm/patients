import {type Mongo} from 'meteor/mongo';

import makeReactive from './makeReactive';

/**
 * Synchronous cursor fetch.
 */
const fetchSync = <T>(cursor: Mongo.Cursor<T>) => {
	// NOTE Adapted from
	// https://github.com/meteor/react-packages/blob/d0645787dac675bbf5412cac0da9387b6315f5c4/packages/react-meteor-data/useFind.ts#L62-L72
	// NOTE Uses cursor observing instead of cursor.fetch() because synchronous
	// fetch is deprecated.
	const items: T[] = [];

	const observer = cursor.observe({
		addedAt(document, atIndex, _before) {
			// TODO Use something more efficient.
			items.splice(atIndex, 0, document);
		},
	});

	if (
		!makeReactive(cursor, {
			addedBefore: true,
			removed: true,
			changed: true,
			movedBefore: true,
		})
	) {
		observer.stop();
	}

	return items;
};

export default fetchSync;
