import db from '../../backend/mongodb/db';
import observeSetChanges from '../query/observeSetChanges';
import type Filter from '../query/Filter';
import type Collection from '../Collection';
import type Document from '../Document';

import duplicates from '../../lib/iterable-iterator/duplicates';
import unique from '../../lib/iterable-iterator/unique';

import {type Context} from './Context';
import type Cursor from './Cursor';

const publishCursors = async <T extends Document, U = T>(
	subscription: Context,
	cursors: Array<Cursor<T, U>>,
): Promise<void> => {
	const collections = cursors.map((cursor) => cursor._getCollectionName());
	const duplicated = Array.from(unique(duplicates(collections)));
	if (duplicated.length > 0) {
		subscription.error(
			new Error(
				`Publish function returned multiple cursors for collections in ${JSON.stringify(
					duplicated,
				)}`,
			),
		);
		return;
	}

	return Promise.all(cursors.map(async (cursor) => _pipe(subscription, cursor)))
		.then((pipes) => {
			for (const pipe of pipes) {
				subscription.onStop(async () => pipe.emit('stop'));
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
