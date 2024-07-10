import observeSetChanges from '../query/observeSetChanges';
import type Filter from '../query/Filter';
import type Document from '../Document';

import duplicates from '../../lib/iterable-iterator/duplicates';
import unique from '../../lib/iterable-iterator/unique';

import {getCollection} from '../collection/registry';

import {type Context} from './Context';
import type Cursor from './Cursor';

const _assertCursorsCanBeMerged = <T extends Document, U = T>(
	cursors: Array<Cursor<T, U>>,
): void => {
	const collections = cursors.map((cursor) => cursor._getCollectionName());
	const duplicated = Array.from(unique(duplicates(collections)));
	if (duplicated.length > 0) {
		throw new Error(
			`Publish function returned multiple cursors for collections in ${JSON.stringify(
				duplicated,
			)}`,
		);
	}
};

const publishCursors = async <T extends Document, U = T>(
	subscription: Context,
	cursors: Array<Cursor<T, U>>,
): Promise<void> => {
	try {
		_assertCursorsCanBeMerged(cursors);
	} catch (error: unknown) {
		subscription.error(error as Error);
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
	const QueriedCollection = getCollection<T, U>(collection);
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
