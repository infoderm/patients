import {type Mongo} from 'meteor/mongo';
import {type DependencyList} from 'react';
import type Publication from './publication/Publication';
import useItem from './publication/useItem';
import useSubscription from './publication/useSubscription';

const makeFindOne =
	<T, U>(Collection: Mongo.Collection<T, U>, publication: Publication) =>
	(
		init: Partial<U>,
		query: Mongo.Selector<T> | string,
		options: Mongo.Options<T>,
		deps: DependencyList,
	) => {
		const isLoading = useSubscription(publication, query, options);
		const loading = isLoading();

		const upToDate = useItem<T, U>(
			loading ? null : Collection,
			typeof query === 'string' ? ({_id: query} as Mongo.Selector<T>) : query,
			options,
			[loading, ...deps],
		);

		const found = Boolean(upToDate);

		const fields = {...init, ...upToDate};

		return {loading, found, fields};
	};

export default makeFindOne;
