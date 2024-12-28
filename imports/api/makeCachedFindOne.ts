import {type DependencyList, useRef} from 'react';

import type PublicationEndpoint from './publication/PublicationEndpoint';
import useSubscription from './publication/useSubscription';
import useItem from './publication/useItem';
import type Collection from './Collection';
import type Document from './Document';
import type UserQuery from './query/UserQuery';
import queryToSelectorOptionsPair from './query/queryToSelectorOptionsPair';

type ReturnValue<U, I> =
	| {loading: boolean; found: false; fields: I & Partial<U>}
	| {loading: boolean; found: true; fields: I & U};

const makeCachedFindOne =
	<T extends Document, U = T>(
		collection: Collection<T, U>,
		publication: PublicationEndpoint<[UserQuery<T>]>,
	) =>
	<I extends Partial<U>>(
		init: I,
		query: UserQuery<T>,
		deps: DependencyList,
	): ReturnValue<U, I> => {
		const ref = useRef(init);

		const isLoading = useSubscription(publication, query);
		const loadingSubscription = isLoading();

		const [selector, options] = queryToSelectorOptionsPair(query);
		const {
			loading: loadingResult,
			found,
			result: upToDate,
		} = useItem(collection, selector, options, deps);

		const fields = {...ref.current, ...upToDate};
		ref.current = fields;

		return {
			loading: loadingSubscription || loadingResult,
			found,
			fields,
		} as ReturnValue<U, I>;
	};

export default makeCachedFindOne;
