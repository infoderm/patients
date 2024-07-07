import db from '../../backend/mongodb/db';
import observeSetChanges from '../query/observeSetChanges';
import type Filter from '../query/Filter';
import type Collection from '../Collection';
import type Document from '../Document';

import {type Context} from './Context';
import type Cursor from './Cursor';

const publishCursors = async <T extends Document, U = T>(
	subscription: Context,
	cursors: Array<Cursor<T, U>>,
): Promise<void> => {
	const collections = new Set<string>();
	for (const collection of cursors.map((cursor) =>
		cursor._getCollectionName(),
	)) {
		// TODO Refactor using duplicates/counter.
		if (collections.has(collection)) {
			subscription.error(
				new Error(
					`Publish function returned multiple cursors for collection ${collection}`,
				),
			);
			return;
		}

		collections.add(collection);
	}

	return Promise.all(cursors.map(async (cursor) => _pipe(subscription, cursor)))
		.then((pipes) => {
			for (const pipe of pipes) {
				subscription.onStop(async () => pipe.stop());
			}

			subscription.ready();
		})
		.catch((error) => {
			subscription.error(error);
		});
};

const _pipe = async <T extends Document, U = T>(
	subscription: Context,
	cursor: Cursor<T, U>,
) => {
	const collection = cursor._getCollectionName();
	const QueriedCollection = db().collection(
		collection,
	) as unknown as Collection<T, U>;
	const {
		_cursorDescription: {selector, options},
	} = cursor;

	const filter = selector as Filter<T>;

	return observeSetChanges(QueriedCollection, filter, options, {
		added(id, fields) {
			subscription.added(collection, id, fields);
		},
		changed(id, fields) {
			subscription.changed(collection, id, fields);
		},
		removed(id) {
			subscription.removed(collection, id);
		},
	});
};

export default publishCursors;
