import {type DependencyList} from 'react';
import type Publication from './publication/Publication';
import useItem from './publication/useItem';
import useSubscription from './publication/useSubscription';
import type Collection from './Collection';
import type Selector from './Selector';
import type Options from './Options';

const makeFindOne =
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

		return {loading, found, fields};
	};

export default makeFindOne;
