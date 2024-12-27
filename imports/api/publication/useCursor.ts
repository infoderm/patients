import {type DependencyList} from 'react';

import type Document from '../Document';

import type Cursor from './Cursor';
import useFind from './useFind';

const useCursor = <T extends Document, U = T>(
	factory: () => Cursor<T, U> | null,
	deps: DependencyList,
): {loading: boolean; results: U[]} => {
	return useFind(factory, deps) ?? [];
};

export default useCursor;
