import {Mongo} from 'meteor/mongo';

import {DependencyList} from 'react';

interface GenericQueryHookReturnType<R> {
	loading?: boolean;
	dirty?: boolean;
	results: R[];
}

type GenericQueryHook<R, T = R> = (
	query: Mongo.Selector<T>,
	options: Mongo.Options<T>,
	deps: DependencyList,
) => GenericQueryHookReturnType<R>;

export default GenericQueryHook;
