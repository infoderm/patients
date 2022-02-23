import {Mongo} from 'meteor/mongo';

import {useDebounce} from 'use-debounce';

import GenericQueryHook from '../../api/GenericQueryHook';
import {escapeStringRegexp} from '../../api/string';
import mergeFields from '../../util/mergeFields';

import {TIMEOUT_INPUT_DEBOUNCE} from '../constants';

const DEBOUNCE_OPTIONS = {leading: false};
// TODO this does not work because we do not render on an empty input

const makeSubstringSuggestions =
	<T>(
		useCollectionFind: GenericQueryHook<T>,
		$nin: string[] = [],
		key = 'name',
		filter?: Mongo.Selector<T> | undefined,
		projection?: Mongo.FieldSpecifier | undefined,
	) =>
	(searchString: string) => {
		const [debouncedSearchString, {isPending, cancel, flush}] = useDebounce(
			searchString,
			TIMEOUT_INPUT_DEBOUNCE,
			DEBOUNCE_OPTIONS,
		);

		const $regex = escapeStringRegexp(debouncedSearchString);
		const limit = 5;
		const query = {
			[key]: {$regex, $options: 'i', $nin},
			...filter,
		};

		const sort = {
			[key]: 1,
		};
		const fields = mergeFields(sort, projection);

		const options = {
			fields,
			sort,
			skip: 0,
			limit,
		};

		const {loading, ...rest} = useCollectionFind(query, options, [
			JSON.stringify(query),
			JSON.stringify(options),
			// refreshKey,
		]);

		return {
			loading: loading || isPending(),
			cancel,
			flush,
			...rest,
		};
	};

export default makeSubstringSuggestions;
