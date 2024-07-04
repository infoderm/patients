import {DiffSequence} from 'meteor/diff-sequence';

import type Collection from '../Collection';
import type Document from '../Document';

import type ObserveSetChangesCallbacks from '../ObserveSetChangesCallbacks';
import {type Options} from '../transaction/TransactionDriver';

import type Filter from './Filter';
import watch from './watch';

const _toSet = <T extends Document>(items: T[]): Map<string, T> =>
	new Map(items.map((item) => [item._id, item]));

const observeSetChanges = async <T extends Document, U = T>(
	collection: Collection<T, U>,
	filter: Filter<T>,
	options: Options,
	observer: ObserveSetChangesCallbacks<T>,
) => {
	let previous = _toSet<T>([]);

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
		async (items: T[]) => {
			const next = _toSet(items);
			DiffSequence.diffQueryUnorderedChanges<T>(
				previous,
				next,
				observer,
				diffOptions,
			);
			previous = next;
		},
	);

	previous = _toSet(init);

	return {stop};
};

export default observeSetChanges;
