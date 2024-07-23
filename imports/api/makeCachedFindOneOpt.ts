import {type DependencyList, useState, useEffect} from 'react';

import useRandom from '../ui/hooks/useRandom';

import type Publication from './publication/Publication';
import subscribe from './publication/subscribe';
import type Options from './query/Options';
import type Collection from './Collection';
import type Document from './Document';
import observeSetChanges from './query/observeSetChanges';
import type Filter from './query/Filter';
import {type WatchHandle} from './query/watch';
import type SubscriptionError from './publication/SubscriptionError';
import stopSubscription from './publication/stopSubscription';

/**
 * WARNING: Does not work properly if used multiple times with the same
 * parameters on the same page.
 */
const makeCachedFindOneOpt =
	<T extends Document, U = T>(
		collection: Collection<T, U>,
		publication: Publication<[Filter<T>, Options<T>]>,
	) =>
	(
		init: Partial<U>,
		filter: Filter<T>,
		options: Options<T>,
		deps: DependencyList,
	) => {
		const [loading, setLoading] = useState(true);
		const [found, setFound] = useState(false);
		const [fields, setFields] = useState(init);
		const [key, reset] = useRandom();

		useEffect(() => {
			setLoading(true);
			setFound(false);
			setFields(init);
			let current = init;

			let queryHandle: WatchHandle<T>;
			let stopped = false;
			const handle = subscribe(publication, filter, options, {
				async onStop(error?: SubscriptionError) {
					stopped = true;
					if (queryHandle !== undefined) await queryHandle.emit('stop', error);
					else reset();
				},
				async onReady() {
					setLoading(false);
					queryHandle = await observeSetChanges(collection, filter, options, {
						added(_id, upToDate) {
							if (stopped) return;
							setFound(true);
							current = {...init, ...upToDate};
							setFields(current);
						},
						changed(_id, upToDate) {
							if (stopped) return;
							current = {...current, ...upToDate};
							setFields(current);
						},
						removed(_id) {
							if (stopped) return;
							setFound(false);
						},
					});
					if (stopped) await queryHandle.emit('stop', undefined);
				},
			});

			return () => {
				stopSubscription(handle);
			};
		}, [key, ...deps]);

		return {loading, found, fields};
	};

export default makeCachedFindOneOpt;
