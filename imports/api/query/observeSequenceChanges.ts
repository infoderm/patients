import {DiffSequence} from 'meteor/diff-sequence';

import type Collection from '../Collection';
import type Document from '../Document';

import type ObserveSequenceChangesCallbacks from '../ObserveSequenceChangesCallbacks';
import {type Options} from '../transaction/TransactionDriver';

import type Filter from './Filter';
import watch from './watch';

const observeSequenceChanges = async <T extends Document, U = T>(
	collection: Collection<T, U>,
	filter: Filter<T>,
	options: Options,
	observer: ObserveSequenceChangesCallbacks<T>,
) => {
	let previous: T[] = [];

	// NOTE We diff ids only if we do not care about change events.
	const diffOptions = observer.changed
		? undefined
		: {
				// @ts-expect-error TODO
				projectionFn: ({_id}: T): Partial<T> => ({_id}),
		  };

	const {init, stop} = await watch<T, U>(
		collection,
		filter,
		options,
		async (next) => {
			DiffSequence.diffQueryOrderedChanges<T>(
				previous,
				next,
				observer,
				diffOptions,
			);
			previous = next;
		},
	);

	previous = init;

	return {stop};
};

export default observeSequenceChanges;
