import {type DependencyList, useEffect, useRef} from 'react';

import useForceUpdate from '../ui/hooks/useForceUpdate';
import useChanged from '../ui/hooks/useChanged';

import type ObservedQueryCacheCollection from './ObservedQueryCacheCollection';

import type Publication from './publication/Publication';
import subscribe from './publication/subscribe';
import type GenericQueryHook from './GenericQueryHook';
import findOneSync from './publication/findOneSync';
import type UserQuery from './query/UserQuery';
import type SubscriptionHandle from './publication/SubscriptionHandle';
import {type ObserveOptions} from './makeObservedQueryPublication';

const makeObservedQueryHook =
	<T>(
		Collection: ObservedQueryCacheCollection<T>,
		publication: Publication<[string, UserQuery<T>, ObserveOptions | null]>,
	): GenericQueryHook<T> =>
	(query: UserQuery<T>, deps: DependencyList) => {
		const loading = useRef<boolean>(true);
		const results = useRef<any[]>([]);
		const dirty = useRef<boolean>(false);
		const handleRef = useRef<SubscriptionHandle | null>(null);
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
			const key = JSON.stringify({timestamp, query});
			const handle = subscribe(publication, key, query, null, {
				onStop() {
					if (handleRef.current === handle) {
						dirty.current = true;
						loading.current = false;
						forceUpdate();
					}
				},
				onReady() {
					if (handleRef.current === handle) {
						results.current = findOneSync(Collection, {key})?.results ?? [];
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
