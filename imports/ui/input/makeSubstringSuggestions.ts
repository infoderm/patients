import {useDebounce} from 'use-debounce';

import type GenericQueryHook from '../../api/GenericQueryHook';
import {escapeStringRegexp} from '../../api/string';
import mergeFields from '../../api/query/mergeFields';

import {TIMEOUT_INPUT_DEBOUNCE} from '../constants';
import type Projection from '../../api/query/Projection';
import type Selector from '../../api/query/Selector';
import {type Sort} from '../../api/query/sort';

const DEBOUNCE_OPTIONS = {leading: false};
// TODO this does not work because we do not render on an empty input

const makeSubstringSuggestions =
	<T>(
		useCollectionFind: GenericQueryHook<T>,
		$nin: string[] = [],
		key = 'name',
		filter?: Selector<T>,
		projection?: Projection<T>,
	) =>
	(searchString: string) => {
		const [debouncedSearchString, {isPending, cancel, flush}] = useDebounce(
			searchString,
			TIMEOUT_INPUT_DEBOUNCE,
			DEBOUNCE_OPTIONS,
		);

		const $regex = escapeStringRegexp(debouncedSearchString);
		const limit = 5;
		const concreteFilter = {
			[key]: {$regex, $options: 'i', $nin},
			...filter,
		};

		const sort = {
			[key]: 1,
		} as Sort<T>;
		const concreteProjection = mergeFields(sort, projection);

		const query = {
			filter: concreteFilter,
			projection: concreteProjection,
			sort,
			skip: 0,
			limit,
		};

		const {loading, ...rest} = useCollectionFind(query, [
			JSON.stringify(query),
			// refreshKey,
		]);

		return {
			loading: Boolean(loading) || isPending(),
			cancel,
			flush,
			...rest,
		};
	};

export default makeSubstringSuggestions;
