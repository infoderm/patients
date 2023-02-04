import {type Mongo} from 'meteor/mongo';
import {type DependencyList} from 'react';

import type Publication from './publication/Publication';
import useSubscription from './publication/useSubscription';
import useCursor from './publication/useCursor';

const makeQuery =
	<T, U>(Collection: Mongo.Collection<T, U>, publication: Publication) =>
	(
		query: Mongo.Selector<T>,
		options: Mongo.Options<T>,
		deps: DependencyList,
	) => {
		const isLoading = useSubscription(publication, query, options);
		const loading = isLoading();
		const results = useCursor(() => Collection.find(query, options), deps);
		return {loading, results};
	};

export default makeQuery;
