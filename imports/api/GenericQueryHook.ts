import {type DependencyList} from 'react';

import type UserQuery from './query/UserQuery';

type GenericQueryHookReturnType<R> = {
	loading?: boolean;
	dirty?: boolean;
	results: R[];
};

type GenericQueryHook<R> = (
	query: UserQuery<R> | null,
	deps: DependencyList,
) => GenericQueryHookReturnType<R>;

export default GenericQueryHook;
