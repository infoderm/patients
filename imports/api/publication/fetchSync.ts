import type Cursor from './Cursor';
import makeCursorReactive from './makeCursorReactive';

/**
 * Synchronous cursor fetch.
 */
const fetchSync = <T, U = T>(cursor: Cursor<T, U>) => {
	// NOTE Adapted from
	// https://github.com/meteor/react-packages/blob/d0645787dac675bbf5412cac0da9387b6315f5c4/packages/react-meteor-data/useFind.ts#L62-L72
	// NOTE Uses cursor observing instead of cursor.fetch() because synchronous
	// fetch is deprecated.
	const items: U[] = [];

	cursor
		.observe({
			addedAt(document, atIndex, _before) {
				// TODO Use something more efficient.
				items.splice(atIndex, 0, document);
			},
		})
		.stop();

	makeCursorReactive(cursor, {
		addedBefore: true,
		removed: true,
		changed: true,
		movedBefore: true,
	});

	return items;
};

export default fetchSync;
