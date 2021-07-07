import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {useState, useEffect, useRef} from 'react';

import ObservedQueryCacheCollection from './ObservedQueryCacheCollection';

const makeObservedQuery =
	<T>(Collection: ObservedQueryCacheCollection, subscription: string) =>
	(query: Mongo.Selector<T>, options: Mongo.Options<T>, deps: any[]) => {
		const [loading, setLoading] = useState(true);
		const [results, setResults] = useState([]);
		const [dirty, setDirty] = useState(false);
		const handleRef = useRef<Meteor.SubscriptionHandle>(null);

		useEffect(() => {
			setDirty(false);
			setLoading(true);

			const timestamp = Date.now();
			const key = JSON.stringify({timestamp, query, options});
			const handle = Meteor.subscribe(subscription, key, query, options, {
				onStop: () => {
					if (handleRef.current === handle) {
						setDirty(true);
						setLoading(false);
					}
				},
				onReady: () => {
					const {results} = Collection.findOne({key});
					setResults(results);
					setLoading(false);
				}
			});
			handleRef.current = handle;

			return () => {
				handle.stop();
			};
		}, deps);

		return {loading, results, dirty};
	};

export default makeObservedQuery;
