import {type DiffOptions, DiffSequence} from 'meteor/diff-sequence';

import type Collection from '../Collection';
import type Document from '../Document';

import type ObserveSequenceChangesCallbacks from '../ObserveSequenceChangesCallbacks';
import {type Options} from '../transaction/TransactionDriver';

import type Filter from './Filter';
import watch from './watch';

const _makeOnChange = <T extends Document>(
	observer: ObserveSequenceChangesCallbacks<T>,
	diffOptions: DiffOptions<T> | undefined,
) => {
	let previous: T[] = [];

	return (next: T[]) => {
		DiffSequence.diffQueryOrderedChanges<T>(
			previous,
			next,
			observer,
			diffOptions,
		);
		previous = next;
	};
};

const observeSequenceChanges = async <T extends Document, U = T>(
	collection: Collection<T, U>,
	filter: Filter<T>,
	options: Options,
	observer: ObserveSequenceChangesCallbacks<T>,
	diffOptions?: DiffOptions<T>,
) => {
	const handle = await watch(collection, filter, options);
	handle.on('change', _makeOnChange(observer, diffOptions));
	void handle.emit('start');
	return handle;
};

export default observeSequenceChanges;
