import {type DependencyList, useEffect, useRef} from 'react';

import useForceUpdate from '../ui/hooks/useForceUpdate';
import useChanged from '../ui/hooks/useChanged';

import type ObservedQueryCacheCollection from './ObservedQueryCacheCollection';

import type Publication from './publication/Publication';
import subscribe from './publication/subscribe';
import type GenericQueryHook from './GenericQueryHook';
import findOneSync from './publication/findOneSync';
import type Selector from './QuerySelector';
import type Options from './QueryOptions';
import type SubscriptionHandle from './publication/SubscriptionHandle';
import {type ObserveOptions} from './makeObservedQueryPublication';

const makeObservedQueryHook =
	<R, T = R>(
		Collection: ObservedQueryCacheCollection<R>,
		publication: Publication<
			[string, Selector<T>, Options<T>, ObserveOptions | null]
		>,
	): GenericQueryHook<R, T> =>
	(selector: Selector<T>, options: Options<T>, deps: DependencyList) => {
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
			const key = JSON.stringify({timestamp, query: selector, options});
			const handle = subscribe(publication, key, selector, options, null, {
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
