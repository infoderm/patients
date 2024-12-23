import {AsyncLock} from '../../lib/async/lock';
import type Collection from '../Collection';
import type Document from '../Document';

import type ObserveSetChangesCallbacks from '../ObserveSetChangesCallbacks';
import {type Options} from '../transaction/TransactionDriver';

import {type Project, diffSets} from './diffSets';

import type Filter from './Filter';
import watch from './watch';

const _toSet = <T extends Document>(items: T[]): Map<string, T> =>
	new Map(items.map((item) => [item._id, item]));

const _makeOnChange = <T extends Document>(
	observer: ObserveSetChangesCallbacks<T>,
	projection?: Project<T>,
) => {
	let previous = _toSet<T>([]);

	// TODO: Use an async queue to be able to cancel previous tasks.
	const lock = new AsyncLock();

	return async (items: T[]) => {
		const next = _toSet(items);
		const handle = await lock.acquire();

		try {
			await diffSets<T>(previous, next, observer, projection);
			previous = next;
		} finally {
			lock.release(handle);
		}
	};
};

const observeSetChanges = async <T extends Document, U = T>(
	collection: Collection<T, U>,
	filter: Filter<T>,
	options: Options,
	observer: ObserveSetChangesCallbacks<T>,
	projection?: Project<T>,
) => {
	const handle = await watch(collection, filter, options);
	handle.on('change', _makeOnChange(observer, projection));
	await handle.emit('start');
	return handle;
};

export default observeSetChanges;
