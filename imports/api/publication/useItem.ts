import {type DependencyList} from 'react';

import type Collection from '../Collection';
import type Document from '../Document';
import type Selector from '../query/Selector';
import type Options from '../query/Options';

import useReactive from './useReactive';
import findOneSync from './findOneSync';

const useItem = <T extends Document, U = T>(
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
