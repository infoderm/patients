import {type DependencyList, useRef} from 'react';
import type Publication from './publication/Publication';
import useSubscription from './publication/useSubscription';
import useItem from './publication/useItem';
import type Collection from './Collection';
import type Selector from './Selector';
import type Options from './Options';

const makeCachedFindOne =
	<T, U>(
		collection: Collection<T, U>,
		publication: Publication<[Selector<T>, Options<T>]>,
	) =>
	(
		init: Partial<U>,
		selector: Selector<T> | string,
		options: Options<T>,
		deps: DependencyList,
	) => {
		const ref = useRef(init);

		const isLoading = useSubscription(publication, selector, options);
		const loading = isLoading();

		const upToDate = useItem(
			loading ? null : collection,
			typeof selector === 'string'
				? ({_id: selector} as Selector<T>)
				: selector,
			options,
			[loading, ...deps],
		);

		const found = Boolean(upToDate);
		const fields = {...ref.current, ...upToDate};
		ref.current = fields;

		return {loading, found, fields};
	};

export default makeCachedFindOne;
