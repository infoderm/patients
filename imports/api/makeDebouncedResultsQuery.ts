import {type DependencyList, useEffect, useRef} from 'react';

import type PublicationEndpoint from './publication/PublicationEndpoint';
import type Collection from './Collection';
import type Document from './Document';
import type UserQuery from './query/UserQuery';
import queryToSelectorOptionsPair from './query/queryToSelectorOptionsPair';
import useQuery from './publication/useQuery';

const init = [];

const makeDebouncedResultsQuery =
	<T extends Document, U = T>(
		collection: Collection<T, U>,
		publication: PublicationEndpoint<[UserQuery<T>]>,
	) =>
	(query: UserQuery<T> | null, deps: DependencyList) => {
		const lastValue = useRef<U[]>(init);

		const {loading, results: currentValue} = useQuery(
			publication,
			[query],
			() => {
				const [selector, options] = queryToSelectorOptionsPair(query!);
				return collection.find(selector, options);
			},
			deps,
			query !== null,
		);

		useEffect(() => {
			if (!loading) {
				lastValue.current = currentValue;
			}
		}, [loading, currentValue]);

		return loading
			? {
					loading: true,
					results: lastValue.current,
			  }
			: {
					loading: false,
					results: currentValue,
			  };
	};

export default makeDebouncedResultsQuery;
