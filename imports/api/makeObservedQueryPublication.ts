import {Mongo} from 'meteor/mongo';

interface ObserveOptions {
	added?: boolean;
	removed?: boolean;
	changed?: boolean;
}

const makeObservedQuerySubscription = <T>(
	QueriedCollection: Mongo.Collection<T>,
	observedQueryCacheCollectionName: string
) =>
	function (
		key: string,
		query: Mongo.Selector<T>,
		options: Mongo.Options<T>,
		observe?: ObserveOptions
	) {
		query = {
			...query,
			owner: this.userId
		};
		observe = {
			added: true,
			removed: true,
			...observe
		};
		const uid = JSON.stringify({
			key,
			query,
			options,
			observe
		});
		const results = [];
		let initializing = true;

		const stop = () => {
			this.stop();
		};

		const observers: Mongo.ObserveChangesCallbacks<T> = {
			added: (_id, fields) => {
				if (initializing) results.push({_id, ...fields});
				else if (observe.added) stop();
			}
		};

		if (observe.removed) observers.removed = stop;
		if (observe.changed) observers.changed = stop;

		const handle = QueriedCollection.find(query, options).observeChanges(
			observers
		);

		// Instead, we'll send one `added` message right after `observeChanges` has
		// returned, and mark the subscription as ready.
		initializing = false;
		this.added(observedQueryCacheCollectionName, uid, {
			key,
			results
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
