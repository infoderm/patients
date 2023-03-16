import {type DependencyList, useEffect, useRef} from 'react';

import type Publication from './publication/Publication';
import useSubscription from './publication/useSubscription';
import useCursor from './publication/useCursor';
import type Options from './QueryOptions';
import type Selector from './QuerySelector';
import type Collection from './Collection';
import type Document from './Document';

const init = [];

const makeDebouncedResultsQuery =
	<T extends Document, U = T>(
		collection: Collection<T, U>,
		publication: Publication<[Selector<T>, Options<T>]>,
	) =>
	(selector: Selector<T>, options: Options<T>, deps: DependencyList) => {
		const lastValue = useRef<U[]>(init);

		const isLoading = useSubscription(publication, selector, options);

		const currentValue = useCursor(
			() => collection.find(selector, options),
			deps,
		);

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
