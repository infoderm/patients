import type Collection from './Collection';
import type ObserveChangesCallbacks from './ObserveChangesCallbacks';
import type Options from './Options';
import type Selector from './Selector';

type ObserveOptions = {
	added?: boolean;
	removed?: boolean;
	changed?: boolean;
};

const makeObservedQuerySubscription = <T, U = T>(
	QueriedCollection: Collection<T, U>,
	observedQueryCacheCollectionName: string,
) =>
	function (
		key: string,
		query: Selector<T>,
		options: Options<T>,
		observe?: ObserveOptions,
	) {
		query = {
			...query,
			owner: this.userId,
		};
		const callbacks: ObserveOptions = {
			added: true,
			removed: true,
			...observe,
		};
		const uid = JSON.stringify({
			key,
			query,
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

		const handle = QueriedCollection.find(query, options).observeChanges(
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

export default makeObservedQuerySubscription;
