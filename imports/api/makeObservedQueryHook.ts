import {type DependencyList, useEffect, useRef, useState} from 'react';

import useChanged from '../ui/hooks/useChanged';

import type ObservedQueryCacheCollection from './ObservedQueryCacheCollection';

import type Publication from './publication/Publication';
import subscribe from './publication/subscribe';
import type GenericQueryHook from './GenericQueryHook';
import type UserQuery from './query/UserQuery';
import {type ObserveOptions} from './makeObservedQueryPublication';
import stopSubscription from './publication/stopSubscription';

const makeObservedQueryHook =
	<T>(
		Collection: ObservedQueryCacheCollection<T>,
		publication: Publication<[string, UserQuery<T>, ObserveOptions | null]>,
		observe: ObserveOptions | null = null,
	): GenericQueryHook<T> =>
	(query: UserQuery<T> | null, deps: DependencyList) => {
		const [loading, setLoading] = useState<boolean>(query !== null);
		const [results, setResults] = useState<any[]>([]);
		const [dirty, setDirty] = useState<boolean>(false);
		const handleRef = useRef<any>(null);

		const effectWillTrigger = useChanged(deps);

		useEffect(() => {
			if (query === null) {
				setLoading(false);
				setResults([]);
				setDirty(false);
				return;
			}

			const id = {};
			handleRef.current = id;
			setDirty(false);
			setLoading(true);

			const timestamp = Date.now();
			const key = JSON.stringify({timestamp, query});
			const handle = subscribe(publication, key, query, observe, {
				onStop() {
					if (handleRef.current === id) {
						setDirty(true);
						setLoading(false);
					}
				},
				async onReady() {
					if (handleRef.current === id) {
						const response = await Collection.findOneAsync({key});
						if (handleRef.current === id) {
							setResults(response?.results ?? []);
							setLoading(false);
						}
					}
				},
			});

			return () => {
				stopSubscription(handle);
			};
		}, deps);

		return query === null ? {
			loading: false,
			results: [],
			dirty: false,
		} : {
			loading: effectWillTrigger || loading,
			results,
			dirty: !effectWillTrigger && dirty,
		};
	};

export default makeObservedQueryHook;
