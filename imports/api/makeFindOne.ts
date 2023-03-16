import {type DependencyList} from 'react';
import type Publication from './publication/Publication';
import useItem from './publication/useItem';
import useSubscription from './publication/useSubscription';
import type Collection from './Collection';
import type Selector from './QuerySelector';
import type Options from './QueryOptions';

type ReturnValue<U, I> =
	| {loading: boolean; found: false; fields: I & Partial<U>}
	| {loading: boolean; found: true; fields: I & U};

const makeFindOne =
	<T, U = T>(
		collection: Collection<T, U>,
		publication: Publication<[Selector<T>, Options<T>]>,
	) =>
	<I extends Partial<U>>(
		init: I,
		selector: Selector<T> | string,
		options: Options<T> | undefined,
		deps: DependencyList,
	): ReturnValue<U, I> => {
		const isLoading = useSubscription(publication, selector, options);
		const loading = isLoading();

		const upToDate = useItem<T, U>(
			loading ? null : collection,
			typeof selector === 'string'
				? ({_id: selector} as Selector<T>)
				: selector,
			options,
			[loading, ...deps],
		);

		const found = Boolean(upToDate);

		const fields = {...init, ...upToDate};

		return {loading, found, fields} as ReturnValue<U, I>;
	};

export default makeFindOne;
