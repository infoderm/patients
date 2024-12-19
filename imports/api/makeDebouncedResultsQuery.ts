import {type DependencyList, useEffect, useRef} from 'react';

import type PublicationEndpoint from './publication/PublicationEndpoint';
import useSubscription from './publication/useSubscription';
import useCursor from './publication/useCursor';
import type Collection from './Collection';
import type Document from './Document';
import type UserQuery from './query/UserQuery';
import queryToSelectorOptionsPair from './query/queryToSelectorOptionsPair';

const init = [];

const makeDebouncedResultsQuery =
	<T extends Document, U = T>(
		collection: Collection<T, U>,
		publication: PublicationEndpoint<[UserQuery<T>]>,
	) =>
	(query: UserQuery<T>, deps: DependencyList) => {
		const lastValue = useRef<U[]>(init);

		const isLoading = useSubscription(publication, [query]);
		const loadingSubscription = isLoading();

		const [selector, options] = queryToSelectorOptionsPair(query);
		const {loading: loadingResults, results: currentValue} = useCursor(
			() => collection.find(selector, options),
			deps,
		);

		const loading = loadingSubscription || loadingResults;

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
