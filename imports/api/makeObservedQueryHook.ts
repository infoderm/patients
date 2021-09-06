import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {DependencyList, useState, useEffect, useRef} from 'react';

import ObservedQueryCacheCollection from './ObservedQueryCacheCollection';

import Publication from './publication/Publication';
import subscribe from './publication/subscribe';

const makeObservedQueryHook =
	<T>(Collection: ObservedQueryCacheCollection, publication: Publication) =>
	(
		query: Mongo.Selector<T>,
		options: Mongo.Options<T>,
		deps: DependencyList,
	) => {
		const [loading, setLoading] = useState(true);
		const [results, setResults] = useState([]);
		const [dirty, setDirty] = useState(false);
		const handleRef = useRef<Meteor.SubscriptionHandle>(null);

		useEffect(() => {
			setDirty(false);
			setLoading(true);

			const timestamp = Date.now();
			const key = JSON.stringify({timestamp, query, options});
			const handle = subscribe(publication, key, query, options, {
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
				},
			});
			handleRef.current = handle;

			return () => {
				handle.stop();
			};
		}, deps);

		return {loading, results, dirty};
	};

export default makeObservedQueryHook;
