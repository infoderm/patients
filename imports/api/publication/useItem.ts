import {type Mongo} from 'meteor/mongo';

import {type DependencyList} from 'react';

import type Collection from '../transaction/Collection';

import useCursor from './useCursor';

const useItem = <T, U = T>(
	collection: Collection<T, U> | null,
	selector: Mongo.Selector<T>,
	options: Mongo.Options<T>,
	deps: DependencyList,
): U | undefined => {
	const values = useCursor(
		() => collection?.find(selector, {...options, limit: 1}),
		deps,
	);

	return values ? values[0] : undefined;
};

export default useItem;
