import {type DependencyList} from 'react';

import type Publication from './publication/Publication';
import useSubscription from './publication/useSubscription';
import useCursor from './publication/useCursor';

import type Collection from './Collection';
import type Selector from './QuerySelector';
import type Options from './QueryOptions';

const makeQuery =
	<T, U>(
		collection: Collection<T, U>,
		publication: Publication<[Selector<T>, Options<T>]>,
	) =>
	(selector: Selector<T>, options: Options<T>, deps: DependencyList) => {
		const isLoading = useSubscription(publication, selector, options);
		const loading = isLoading();
		const results = useCursor(() => collection.find(selector, options), deps);
		return {loading, results};
	};

export default makeQuery;
