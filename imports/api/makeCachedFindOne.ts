import {type DependencyList, useRef} from 'react';
import {type Mongo} from 'meteor/mongo';
import type Publication from './publication/Publication';
import useSubscription from './publication/useSubscription';
import useItem from './publication/useItem';

const makeCachedFindOne =
	<T, U>(Collection: Mongo.Collection<T, U>, publication: Publication) =>
	(
		init: Partial<U>,
		query: Mongo.Selector<T> | string,
		options: Mongo.Options<T>,
		deps: DependencyList,
	) => {
		const ref = useRef(init);

		const isLoading = useSubscription(publication, query, options);
		const loading = isLoading();

		const upToDate = useItem(
			loading ? null : Collection,
			typeof query === 'string' ? ({_id: query} as Mongo.Selector<T>) : query,
			options,
			[loading, ...deps],
		);

		const found = Boolean(upToDate);
		const fields = {...ref.current, ...upToDate};
		ref.current = fields;

		return {loading, found, fields};
	};

export default makeCachedFindOne;
