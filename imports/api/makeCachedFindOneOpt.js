import {Meteor} from 'meteor/meteor';
import {useState, useEffect} from 'react';

import useRandom from '../ui/hooks/useRandom.js';

/**
 * WARNING: Does not work properly if used multiple times with the same
 * parameters on the same page.
 */
const makeCachedFindOneOpt =
	(Collection, subscription) => (init, query, options, deps) => {
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

			let queryHandle;
			const handle = Meteor.subscribe(subscription, query, options, {
				onStop: (e) => {
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
						}
					});
				}
			});

			return () => {
				console.debug('handle.stop()');
				handle.stop();
			};
		}, [key, ...deps]);

		return {loading, found, fields};
	};

export default makeCachedFindOneOpt;
