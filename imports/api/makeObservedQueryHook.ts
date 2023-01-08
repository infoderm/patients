import {type Meteor} from 'meteor/meteor';
import {type Mongo} from 'meteor/mongo';
import {type DependencyList, useEffect, useRef} from 'react';

import useForceUpdate from '../ui/hooks/useForceUpdate';
import useChanged from '../ui/hooks/useChanged';

import type ObservedQueryCacheCollection from './ObservedQueryCacheCollection';

import type Publication from './publication/Publication';
import subscribe from './publication/subscribe';
import type GenericQueryHook from './GenericQueryHook';

const makeObservedQueryHook =
	<R, T = R>(
		Collection: ObservedQueryCacheCollection<R>,
		publication: Publication,
	): GenericQueryHook<R, T> =>
	(
		query: Mongo.Selector<T>,
		options: Mongo.Options<T>,
		deps: DependencyList,
	) => {
		const loading = useRef<boolean>(true);
		const results = useRef<any[]>([]);
		const dirty = useRef<boolean>(false);
		const handleRef = useRef<Meteor.SubscriptionHandle>(null);
		const forceUpdate = useForceUpdate();

		const effectWillTrigger = useChanged(deps);

		if (effectWillTrigger) {
			// This is to make sure we return the correct values on first
			// render.
			// TODO Find a better way to do this. It may cause problems in
			// future concurrent mode.
			dirty.current = false;
			loading.current = true;
		}

		useEffect(() => {
			dirty.current = false;
			loading.current = true;

			const timestamp = Date.now();
			const key = JSON.stringify({timestamp, query, options});
			const handle = subscribe(publication, key, query, options, {
				onStop() {
					if (handleRef.current === handle) {
						dirty.current = true;
						loading.current = false;
						forceUpdate();
					}
				},
				onReady() {
					if (handleRef.current === handle) {
						results.current = Collection.findOne({key})?.results ?? [];
						loading.current = false;
						forceUpdate();
					}
				},
			});
			handleRef.current = handle;

			return () => {
				handle.stop();
			};
		}, deps);

		return {
			loading: loading.current,
			results: results.current,
			dirty: dirty.current,
		};
	};

export default makeObservedQueryHook;
