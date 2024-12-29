import {type DependencyList, useRef} from 'react';

import type PublicationEndpoint from './publication/PublicationEndpoint';
import useSubscription from './publication/useSubscription';
import useItem from './publication/useItem';
import type Collection from './Collection';
import type Document from './Document';
import type UserQuery from './query/UserQuery';
import queryToSelectorOptionsPair from './query/queryToSelectorOptionsPair';
import {documentDiff, documentDiffApply} from './update';

type ReturnValue<U, I> =
	| {loading: boolean; found: false; fields: I & Partial<U>}
	| {loading: boolean; found: true; fields: I & U};

const makeCachedFindOne =
	<T extends Document, U extends Document = T>(
		collection: Collection<T, U>,
		publication: PublicationEndpoint<[UserQuery<T>]>,
	) =>
	<I extends Partial<U>>(
		init: I,
		query: UserQuery<T>,
		deps: DependencyList,
	): ReturnValue<U, I> => {
		const ref = useRef(init);

		const isLoading = useSubscription(publication, [query]);
		const loadingSubscription = isLoading();

		const [selector, options] = queryToSelectorOptionsPair(query);
		const {
			loading: loadingResult,
			found,
			result: upToDate,
		} = useItem(collection, selector, options, deps);

		if (upToDate !== undefined) {
			const _diff = documentDiff(ref.current, upToDate);
			ref.current = documentDiffApply(ref.current, _diff);
		}

		return {
			loading: loadingSubscription || loadingResult,
			found,
			fields: ref.current,
		} as ReturnValue<U, I>;
	};

export default makeCachedFindOne;
