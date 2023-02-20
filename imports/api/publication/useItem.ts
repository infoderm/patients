import {type Mongo} from 'meteor/mongo';

import {type DependencyList} from 'react';

import type Collection from '../transaction/Collection';

import useReactive from './useReactive';
import findOneSync from './findOneSync';

const useItem = <T, U = T>(
	collection: Collection<T, U> | null,
	selector: Mongo.Selector<T>,
	options: Mongo.Options<T>,
	deps: DependencyList,
): U | undefined =>
	useReactive(
		() =>
			collection === null
				? undefined
				: findOneSync(collection, selector, options),
		deps,
	);

export default useItem;
