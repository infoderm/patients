import schema from '../lib/schema';

import type Collection from './Collection';
import type Document from './Document';
import type ObserveChangesCallbacks from './ObserveChangesCallbacks';
import queryToSelectorOptionsPair from './query/queryToSelectorOptionsPair';
import type UserQuery from './query/UserQuery';
import {userQuery} from './query/UserQuery';

const observeOptions = schema
	.object({
		added: schema.boolean().optional(),
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
	function (key: string, query: UserQuery<T>, observe: ObserveOptions | null) {
		let [selector, options] = queryToSelectorOptionsPair(query);
		selector = {
			...selector,
			owner: this.userId,
		};
		const callbacks: ObserveOptions = {
			added: true,
			removed: true,
			...observe,
		};
		const uid = JSON.stringify({
			key,
			selector,
			options,
			observe,
		});
		const results: T[] = [];
		let initializing = true;

		const stop = () => {
			this.stop();
		};

		const observers: ObserveChangesCallbacks<T> = {
			added(_id, fields) {
				if (initializing) results.push({_id, ...fields} as unknown as T);
				else if (callbacks.added) stop();
			},
		};

		if (callbacks.removed) observers.removed = stop;
		if (callbacks.changed) observers.changed = stop;

		const handle = QueriedCollection.find(selector, options).observeChanges(
			observers,
		);

		// Instead, we'll send one `added` message right after `observeChanges` has
		// returned, and mark the subscription as ready.
		initializing = false;
		this.added(observedQueryCacheCollectionName, uid, {
			key,
			results,
		});
		this.ready();

		// Stop observing the cursor when the client unsubscribes. Stopping a
		// subscription automatically takes care of sending the client any `removed`
		// messages.
		this.onStop(() => {
			handle.stop();
		});
	};

export default makeObservedQueryPublication;
