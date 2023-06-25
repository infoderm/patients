import {type DependencyList} from 'react';
import {useFind} from 'meteor/react-meteor-data';

import type Cursor from './Cursor';

const useCursor = <T, U = T>(
	factory: () => Cursor<T, U> | undefined | null,
	deps: DependencyList,
): U[] => {
	// @ts-expect-error useFind types are wrong or incomplete.
	return useFind(factory, deps) ?? [];
};

export default useCursor;
