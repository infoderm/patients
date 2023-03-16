import {type DependencyList} from 'react';

import type Collection from '../Collection';
import type Selector from '../QuerySelector';
import type Options from '../QueryOptions';

import useReactive from './useReactive';
import findOneSync from './findOneSync';

const useItem = <T, U = T>(
	collection: Collection<T, U> | null,
	selector: Selector<T>,
	options: Options<T> | undefined,
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
