import {type DependencyList} from 'react';

import type PublicationEndpoint from './publication/PublicationEndpoint';
import useItem from './publication/useItem';
import useSubscription from './publication/useSubscription';
import type Collection from './Collection';
import type Document from './Document';
import type UserQuery from './query/UserQuery';
import queryToSelectorOptionsPair from './query/queryToSelectorOptionsPair';

type ReturnValue<U, I> =
	| {loading: boolean; found: false; fields: I & Partial<U>}
	| {loading: boolean; found: true; fields: I & U};

const makeFindOne =
	<T extends Document, U = T>(
		collection: Collection<T, U>,
		publication: PublicationEndpoint<[UserQuery<T>]>,
	) =>
	<I extends Partial<U>>(
		init: I,
		query: UserQuery<T>,
		deps: DependencyList,
	): ReturnValue<U, I> => {
		const isLoading = useSubscription(publication, [query]);
		const loadingSubscription = isLoading();

		const [selector, options] = queryToSelectorOptionsPair(query);
		const {
			loading: loadingResult,
			found,
			result: upToDate,
		} = useItem(collection, selector, options, deps);

		const fields = {...init, ...upToDate};

		return {
			loading: loadingSubscription || loadingResult,
			found,
			fields,
		} as ReturnValue<U, I>;
	};

export default makeFindOne;
