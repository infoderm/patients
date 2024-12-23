import assert from 'assert';

import {AsyncQueue} from '../../lib/async/queue';

import type Document from '../Document';

import type ObserveSequenceChangesCallbacks from '../ObserveSequenceChangesCallbacks';
import {documentDiff, isDiffEmpty} from '../update';
import {lis} from '../../lib/lcs/lis';

const identity = <T>(x: T) => x;
export type Project<T> = (document: T) => Partial<T>;

export const diffSequences = async <T extends Document>(
	prev: T[],
	next: T[],
	observer: ObserveSequenceChangesCallbacks<T>,
	projection: Project<T> = identity,
): Promise<void> => {
	const queue = new AsyncQueue();
	_diffSequences<T>(queue, prev, next, observer, projection);
	return queue.drain();
};

const _diffSequences = <T extends Document>(
	queue: AsyncQueue,
	prev: T[],
	next: T[],
	{
		addedBefore,
		removed,
		movedBefore,
		changed,
	}: ObserveSequenceChangesCallbacks<T>,
	projection: Project<T>,
) => {
	// NOTE: First, we handle all removed items.
	if (removed !== undefined) {
		const nextIds = new Set<string>();
		for (const {_id} of next) {
			assert(!nextIds.has(_id), `Duplicate _id ${_id} in next`);
			nextIds.add(_id);
		}

		for (const {_id} of prev) {
			if (!nextIds.has(_id)) {
				// NOTE: Item is in prev, but not in next.
				queue.enqueue(async () => removed(_id));
			}
		}
	}

	// NOTE: Then, we handle changed, moved, and added items.
	// Suppose we have identified a sequence of "unmoved" items: items that
	// have the same relative positions in prev and next.
	// All we need to do then is to move the other items, interleave the
	// added items with respect to those, and notify of any item changes.
	// For this purpose, we will map next items to prev items, so we need an
	// index:
	const prevIndex = new Map<string, number>();
	let i = -1;
	for (const {_id} of prev) {
		assert(!prevIndex.has(_id), `Duplicate _id ${_id} in prev`);
		prevIndex.set(_id, ++i);
	}

	// NOTE: A common subsequence of the item ids in prev and
	// next corresponds to a set of elements that can be considered unmoved,
	// since their relative positions have not changed.
	// Since each item appears only once in each of prev and next, this can be
	// simplified to mapping their indices. We can take next as the reference
	// identity permutation, and thus this reduces to computing
	// an increasing subsequence of the indices in prev of the items in
	// next.
	// We compute the longest such sequence to minimize resource consumption.
	const intersection = next
		.map(({_id}: T, index: number) => ({_id, index}))
		.filter(({_id}) => prevIndex.has(_id));

	const unmoved = lis(
		intersection.length,
		// NOTE: Sequence of prev indices of next items.
		Int32Array.from(intersection, ({_id}) => prevIndex.get(_id)!),
	).map((i: number) => intersection[i]!.index);

	// NOTE: The last group is anchored at the end.
	const groups = [...unmoved, next.length];

	const processChanges =
		changed === undefined
			? undefined
			: (prevItem: T, nextItem: T) => {
					const changes = documentDiff(
						projection(prevItem),
						projection(nextItem),
					);
					if (!isDiffEmpty(changes)) {
						queue.enqueue(async () =>
							changed(
								nextItem._id,
								Object.fromEntries(
									Object.entries(changes).map(([key, value]) => [
										key,
										value === null ? undefined : value,
									]),
								) as Partial<T>,
							),
						);
					}
			  };

	// NOTE: Iterate though each group anchored by an unmoved item at its end.
	let start = 0;
	for (const end of groups) {
		const last = next[end];
		// NOTE: This handles the last group.
		const groupId = last !== undefined ? last._id : null;
		for (let i = start; i < end; ++i) {
			const nextItem = next[i]!;
			const oldIndex = prevIndex.get(nextItem._id);
			if (oldIndex === undefined) {
				// NOTE: Added items.
				if (addedBefore !== undefined) {
					const {_id, ...fields} = projection(nextItem);
					queue.enqueue(async () => addedBefore(nextItem._id, fields, groupId));
				}
			} else {
				// NOTE: Moved items.
				if (processChanges !== undefined) {
					processChanges(prev[oldIndex]!, nextItem);
				}

				if (movedBefore !== undefined) {
					queue.enqueue(async () => movedBefore(nextItem._id, groupId));
				}
			}
		}

		if (last !== undefined && processChanges !== undefined) {
			// NOTE: Last (unmoved) item.
			processChanges(prev[prevIndex.get(last._id)!]!, last);
		}

		start = end + 1;
	}
};
