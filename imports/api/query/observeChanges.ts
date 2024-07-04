import {DiffSequence} from 'meteor/diff-sequence';
import {LocalCollection} from 'meteor/minimongo';

import type Collection from '../Collection';
import type Document from '../Document';

import type ObserveChangesCallbacks from '../ObserveChangesCallbacks';
import {type Options} from '../transaction/TransactionDriver';

import type Filter from './Filter';
import watch from './watch';

const observeChanges = async <T extends Document, U = T>(
	collection: Collection<T, U>,
	filter: Filter<T>,
	options: Options,
	observer: ObserveChangesCallbacks<T>,
) => {
	const isOrdered = LocalCollection._observeCallbacksAreOrdered(observer);

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
			DiffSequence.diffQueryChanges<T>(
				isOrdered,
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

export default observeChanges;
