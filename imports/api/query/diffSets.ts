import {AsyncQueue} from '../../lib/async/queue';

import type Document from '../Document';

import type ObserveSetChangesCallbacks from '../ObserveSetChangesCallbacks';
import {documentDiff, isDiffEmpty} from '../update';

const identity = <T>(x: T) => x;
export type Project<T> = (document: T) => Partial<T>;

export const diffSets = async <T extends Document>(
	prev: Map<string, T>,
	next: Map<string, T>,
	observer: ObserveSetChangesCallbacks<T>,
	projection: Project<T> = identity,
): Promise<void> => {
	const queue = new AsyncQueue();
	_diffSets<T>(queue, prev, next, observer, projection);
	return queue.drain();
};

const _diffSets = <T extends Document>(
	queue: AsyncQueue,
	prev: Map<string, T>,
	next: Map<string, T>,
	{added, changed, removed}: ObserveSetChangesCallbacks<T>,
	projection: Project<T>,
) => {
	if (changed !== undefined || added !== undefined) {
		for (const [id, nextItem] of next) {
			const prevItem = prev.get(id);
			if (prevItem !== undefined) {
				if (changed !== undefined) {
					const changes = documentDiff(
						projection(prevItem),
						projection(nextItem),
					);
					if (!isDiffEmpty(changes)) {
						// TODO: DRY.
						queue.enqueue(async () =>
							changed(
								id,
								Object.fromEntries(
									Object.entries(changes).map(([key, value]) => [
										key,
										value === null ? undefined : value,
									]),
								) as Partial<T>,
							),
						);
					}
				}
			} else if (added !== undefined) {
				const {_id, ...fields} = projection(nextItem);
				queue.enqueue(async () => added(nextItem._id, fields));
			}
		}
	}

	if (removed) {
		for (const id of prev.keys()) {
			if (!next.has(id)) {
				queue.enqueue(async () => removed(id));
			}
		}
	}
};
