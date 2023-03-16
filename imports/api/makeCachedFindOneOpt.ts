import {type DependencyList, useState, useEffect} from 'react';
import {type Meteor} from 'meteor/meteor';

import useRandom from '../ui/hooks/useRandom';
import type Publication from './publication/Publication';
import subscribe, {type SubscriptionError} from './publication/subscribe';
import type Options from './QueryOptions';
import type Selector from './QuerySelector';
import type Collection from './Collection';
import type Document from './Document';

type LiveQueryHandle = Meteor.LiveQueryHandle;

/**
 * WARNING: Does not work properly if used multiple times with the same
 * parameters on the same page.
 */
const makeCachedFindOneOpt =
	<T extends Document, U = T>(
		collection: Collection<T, U>,
		publication: Publication<[Selector<T>, Options<T>]>,
	) =>
	(
		init: Partial<U>,
		selector: Selector<T>,
		options: Options<T>,
		deps: DependencyList,
	) => {
		console.debug({init, query: selector, options, deps});

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

			let queryHandle: LiveQueryHandle;
			const handle = subscribe(publication, selector, options, {
				onStop(e: SubscriptionError) {
					console.debug('onStop()', {e, queryHandle});
					if (queryHandle) queryHandle.stop();
					else reset();
				},
				onReady() {
					console.debug('onReady()');
					setLoading(false);
					queryHandle = collection.find(selector, options).observeChanges({
						added(_id, upToDate) {
							setFound(true);
							current = {...init, ...upToDate};
							setFields(current);
						},
						changed(_id, upToDate) {
							current = {...current, ...upToDate};
							setFields(current);
						},
						removed(_id) {
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
