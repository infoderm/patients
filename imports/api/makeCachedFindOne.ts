import {type DependencyList, useRef} from 'react';
import type Publication from './publication/Publication';
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
		publication: Publication<[UserQuery<T>]>,
	) =>
	<I extends Partial<U>>(
		init: I,
		query: UserQuery<T>,
		deps: DependencyList,
	): ReturnValue<U, I> => {
		const ref = useRef(init);

		const isLoading = useSubscription(publication, query);
		const loading = isLoading();

		const [selector, options] = queryToSelectorOptionsPair(query);
		const upToDate = useItem(loading ? null : collection, selector, options, [
			loading,
			...deps,
		]);

		const found = Boolean(upToDate);
		const fields = {...ref.current, ...upToDate};
		ref.current = fields;

		return {loading, found, fields} as ReturnValue<U, I>;
	};

export default makeCachedFindOne;
