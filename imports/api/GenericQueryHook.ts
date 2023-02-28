import {type DependencyList} from 'react';
import type Options from './Options';
import type Selector from './Selector';

type GenericQueryHookReturnType<R> = {
	loading?: boolean;
	dirty?: boolean;
	results: R[];
};

type GenericQueryHook<R, T = R> = (
	query: Selector<T>,
	options: Options<T>,
	deps: DependencyList,
) => GenericQueryHookReturnType<R>;

export default GenericQueryHook;
