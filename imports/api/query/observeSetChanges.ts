import {type DiffOptions, DiffSequence} from 'meteor/diff-sequence';

import type Collection from '../Collection';
import type Document from '../Document';

import type ObserveSetChangesCallbacks from '../ObserveSetChangesCallbacks';
import {type Options} from '../transaction/TransactionDriver';

import type Filter from './Filter';
import watch from './watch';

const _toSet = <T extends Document>(items: T[]): Map<string, T> =>
	new Map(items.map((item) => [item._id, item]));

const _makeOnChange = <T extends Document>(
	observer: ObserveSetChangesCallbacks<T>,
	diffOptions: DiffOptions<T> | undefined,
) => {
	let previous = _toSet<T>([]);

	return (items: T[]) => {
		const next = _toSet(items);
		// TODO Should have an async/await version of this.
		DiffSequence.diffQueryUnorderedChanges<T>(
			previous,
			next,
			observer,
			diffOptions,
		);
		previous = next;
	};
};

const observeSetChanges = async <T extends Document, U = T>(
	collection: Collection<T, U>,
	filter: Filter<T>,
	options: Options,
	observer: ObserveSetChangesCallbacks<T>,
	diffOptions?: DiffOptions<T>,
) => {
	const handle = await watch(collection, filter, options);
	handle.on('change', _makeOnChange(observer, diffOptions));
	await handle.emit('start');
	return handle;
};

export default observeSetChanges;
