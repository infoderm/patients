import {type Mongo} from 'meteor/mongo';
import {type DependencyList, useEffect, useRef} from 'react';

import type Publication from './publication/Publication';
import useSubscription from './publication/useSubscription';
import useCursor from './publication/useCursor';

const init = [];

const makeDebouncedResultsQuery =
	<T, U>(Collection: Mongo.Collection<T, U>, publication: Publication) =>
	(
		query: Mongo.Selector<T>,
		options: Mongo.Options<T>,
		deps: DependencyList,
	) => {
		const lastValue = useRef(init);

		const isLoading = useSubscription(publication, query, options);

		const currentValue = useCursor(() => Collection.find(query, options), deps);

		const loading = isLoading();

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
