import {type Mongo} from 'meteor/mongo';

import {type DependencyList} from 'react';

type GenericQueryHookReturnType<R> = {
	loading?: boolean;
	dirty?: boolean;
	results: R[];
};

type GenericQueryHook<R, T = R> = (
	query: Mongo.Selector<T>,
	options: Mongo.Options<T>,
	deps: DependencyList,
) => GenericQueryHookReturnType<R>;

export default GenericQueryHook;
