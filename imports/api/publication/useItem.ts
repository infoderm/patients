import assert from 'assert';

import {type DependencyList} from 'react';

import type Collection from '../Collection';
import type Document from '../Document';
import type Selector from '../query/Selector';
import type Options from '../query/Options';

import useCursor from './useCursor';

const useItem = <T extends Document, U = T>(
	collection: Collection<T, U> | null,
	selector: Selector<T>,
	options: Options<T> | undefined,
	deps: DependencyList,
) => {
	const {loading, results: items} = useCursor(
		() =>
			collection === null
				? null
				: collection.find(selector, {...options, limit: 1}),
		deps,
	);

	assert(items.length <= 1, `useItem got items.length === ${items.length}`);
	const result = items[0];
	const found = Boolean(result);
	return {loading, found, result};
};

export default useItem;
