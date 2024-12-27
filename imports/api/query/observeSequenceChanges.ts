import {AsyncLock} from '../../lib/async/lock';
import type Collection from '../Collection';
import type Document from '../Document';

import type ObserveSequenceChangesCallbacks from '../ObserveSequenceChangesCallbacks';
import {type Options} from '../transaction/TransactionDriver';

import {diffSequences, type Project} from './diffSequences';

import type Filter from './Filter';
import watch from './watch';

const _makeOnChange = <T extends Document>(
	observer: ObserveSequenceChangesCallbacks<T>,
	projection?: Project<T>,
) => {
	let previous: T[] = [];

	// TODO: Use an async queue to be able to cancel previous tasks.
	const lock = new AsyncLock();

	return async (next: T[]) => {
		const handle = await lock.acquire();
		try {
			await diffSequences<T>(previous, next, observer, projection);
			previous = next;
		} finally {
			lock.release(handle);
		}
	};
};

const observeSequenceChanges = async <T extends Document, U = T>(
	collection: Collection<T, U>,
	filter: Filter<T>,
	options: Options,
	observer: ObserveSequenceChangesCallbacks<T>,
	projection?: Project<T>,
) => {
	const handle = await watch(collection, filter, options);
	handle.on('change', _makeOnChange(observer, projection));
	await handle.emit('start');
	return handle;
};

export default observeSequenceChanges;
