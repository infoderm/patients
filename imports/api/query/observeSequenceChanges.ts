import {AsyncLock} from '../../util/async/lock';
import { defer } from '../../util/async/defer';
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

	const drain = async () => {
		return defer(async () => {
			const handle = await lock.acquire();
			lock.release(handle);
		}).resolution();
	};

	const onChange = async (next: T[]) => {
		const handle = await lock.acquire();
		try {
			await diffSequences<T>(previous, next, observer, projection);
			previous = next;
		} finally {
			lock.release(handle);
		}
	};

	return {drain, onChange};
};

const observeSequenceChanges = async <T extends Document, U = T>(
	collection: Collection<T, U>,
	filter: Filter<T>,
	options: Options,
	observer: ObserveSequenceChangesCallbacks<T>,
	projection?: Project<T>,
) => {
	const handle = await watch(collection, filter, options);
	const {drain, onChange} = _makeOnChange(observer, projection);
	handle.on('change', onChange);
	await handle.emit('start');

	const stop = async (error?: Error) => handle.emit('stop', error);
	return {
		drain,
		stop
	};
};

export default observeSequenceChanges;
