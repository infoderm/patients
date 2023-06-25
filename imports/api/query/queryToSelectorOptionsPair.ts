import removeUndefined from '../../lib/object/removeUndefined';

import type Selector from './Selector';
import type Options from './Options';
import type UserQuery from './UserQuery';

const queryToSelectorOptionsPair = <T>(query: UserQuery<T>) => {
	const selector = query.filter as Selector<T>;
	const {projection, sort, skip, limit} = query;
	const options = removeUndefined({
		fields: projection,
		sort,
		skip,
		limit,
	}) as Options<T>;
	return [selector, options] as const;
};

export default queryToSelectorOptionsPair;
