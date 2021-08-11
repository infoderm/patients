import {DependencyList, useState, useEffect} from 'react';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

import useRandom from '../ui/hooks/useRandom';

/**
 * WARNING: Does not work properly if used multiple times with the same
 * parameters on the same page.
 */
const makeCachedFindOneOpt =
	<T, U>(Collection: Mongo.Collection<T, U>, subscription: string) =>
	(
		init: Partial<U>,
		query: Mongo.Selector<T>,
		options: Mongo.Options<T>,
		deps: DependencyList,
	) => {
		console.debug({init, query, options, deps});

		const [loading, setLoading] = useState(true);
		const [found, setFound] = useState(false);
		const [fields, setFields] = useState(init);
		const [key, reset] = useRandom();

		console.debug({loading, found, fields});

		useEffect(() => {
			setLoading(true);
			setFound(false);
			setFields(init);
			let current = init;

			let queryHandle: Meteor.LiveQueryHandle;
			const handle = Meteor.subscribe(subscription, query, options, {
				onStop: (e: Meteor.Error) => {
					console.debug('onStop()', {e, queryHandle});
					if (queryHandle) queryHandle.stop();
					else reset();
				},
				onReady: () => {
					console.debug('onReady()');
					setLoading(false);
					queryHandle = Collection.find(query, options).observeChanges({
						added: (_id, upToDate) => {
							setFound(true);
							current = {...init, ...upToDate};
							setFields(current);
						},
						changed: (_id, upToDate) => {
							current = {...current, ...upToDate};
							setFields(current);
						},
						removed: (_id) => {
							setFound(false);
						},
					});
				},
			});

			return () => {
				console.debug('handle.stop()');
				handle.stop();
			};
		}, [key, ...deps]);

		return {loading, found, fields};
	};

export default makeCachedFindOneOpt;
