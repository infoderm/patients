import {DiffSequence} from 'meteor/diff-sequence';

import schema from '../lib/schema';

import type Collection from './Collection';
import type Document from './Document';
import type Filter from './query/Filter';
import type ObserveChangesCallbacks from './ObserveChangesCallbacks';
import queryToSelectorOptionsPair from './query/queryToSelectorOptionsPair';
import {userQuery} from './query/UserQuery';
import type UserQuery from './query/UserQuery';
import watch from './query/watch';

const observeOptions = schema
	.object({
		addedBefore: schema.boolean().optional(),
		movedBefore: schema.boolean().optional(),
		removed: schema.boolean().optional(),
		changed: schema.boolean().optional(),
	})
	.strict();

export type ObserveOptions = schema.infer<typeof observeOptions>;

export const publicationSchema = <S extends schema.ZodTypeAny>(tSchema: S) =>
	schema.tuple([
		schema.string(),
		userQuery(tSchema),
		observeOptions.nullable(),
	]);

const makeObservedQueryPublication = <T extends Document, U = T>(
	QueriedCollection: Collection<T, U>,
	observedQueryCacheCollectionName: string,
) =>
	async function (
		key: string,
		query: UserQuery<T>,
		observe: ObserveOptions | null,
	) {
		let [selector, options] = queryToSelectorOptionsPair(query);
		selector = {
			...selector,
			owner: this.userId,
		};

		const callbacks: ObserveOptions = {
			addedBefore: true,
			movedBefore: true,
			removed: true,
			...observe,
		};

		const uid = JSON.stringify({
			key,
			selector,
			options,
			observe,
		});

		const stop = () => {
			this.stop();
		};

		// NOTE We only diff ids if we do not care about change events.
		const diffOptions = callbacks.changed
			? undefined
			: {
					// @ts-expect-error TODO
					projectionFn: ({_id}: T): Partial<T> => ({_id}),
			  };

		const observer: ObserveChangesCallbacks<T> = {};

		if (callbacks.addedBefore) observer.addedBefore = stop;
		if (callbacks.movedBefore) observer.movedBefore = stop;
		if (callbacks.removed) observer.removed = stop;
		if (callbacks.changed) observer.changed = stop;

		const handle = await watch<T, U>(
			QueriedCollection,
			selector as Filter<T>,
			options,
			async (init) => {
				DiffSequence.diffQueryOrderedChanges<T>(
					handle.init,
					init,
					observer,
					diffOptions,
				);
			},
		);

		const results = handle.init;

		this.added(observedQueryCacheCollectionName, uid, {
			key,
			results,
		});
		this.ready();

		// NOTE: Stop observing the cursor when the client unsubscribes.
		this.onStop(async () => {
			await handle.stop();
		});
	};

export default makeObservedQueryPublication;
