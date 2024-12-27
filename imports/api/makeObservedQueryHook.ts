import {type DependencyList, useEffect, useRef, useState} from 'react';

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
		const [loading, setLoading] = useState<boolean>(true);
		const [results, setResults] = useState<any[]>([]);
		const [dirty, setDirty] = useState<boolean>(false);
		const handleRef = useRef<SubscriptionHandle | null>(null);

		const effectWillTrigger = useChanged(deps);

		useEffect(() => {
			setDirty(false);
			setLoading(true);

			const timestamp = Date.now();
			const key = JSON.stringify({timestamp, query});
			const handle = subscribe(publication, key, query, null, {
				onStop() {
					if (handleRef.current === handle) {
						setDirty(true);
						setLoading(false);
					}
				},
				onReady() {
					if (handleRef.current === handle) {
						setResults(findOneSync(Collection, {key})?.results ?? []);
						setLoading(false);
					}
				},
			});
			handleRef.current = handle;

			return () => {
				handle.stop();
			};
		}, deps);

		return {
			loading: effectWillTrigger || loading,
			results,
			dirty: !effectWillTrigger && dirty,
		};
	};

export default makeObservedQueryHook;
