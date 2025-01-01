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
	(query: UserQuery<T> | null, deps: DependencyList) => {
		const isLoading = useSubscription(
			query === null ? null : publication,
			query,
		);
		const loadingSubscription = isLoading();
		const [selector, options] =
			query === null ? [] : queryToSelectorOptionsPair(query);
		const {loading: loadingResults, results} = useCursor(
			() => (query === null ? null : collection.find(selector, options)),
			deps,
		);
		const loading = loadingSubscription || loadingResults;
		return {loading, results};
	};

export default makeQuery;
