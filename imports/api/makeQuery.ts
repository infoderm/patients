import {type DependencyList} from 'react';

import type Publication from './publication/Publication';
import useSubscription from './publication/useSubscription';
import useCursor from './publication/useCursor';

import type Collection from './Collection';
import type Document from './Document';
import type UserQuery from './query/UserQuery';
import queryToSelectorOptionsPair from './query/queryToSelectorOptionsPair';

const makeQuery =
	<T extends Document, U = T>(
		collection: Collection<T, U>,
		publication: Publication<[UserQuery<T>]>,
	) =>
	(query: UserQuery<T>, deps: DependencyList) => {
		const isLoading = useSubscription(publication, query);
		const loading = isLoading();
		const [selector, options] = queryToSelectorOptionsPair(query);
		const results = useCursor(() => collection.find(selector, options), deps);
		return {loading, results};
	};

export default makeQuery;
