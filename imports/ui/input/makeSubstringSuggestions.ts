import {useDebounce} from 'use-debounce';
import {escapeStringRegexp} from '../../api/string';

import {TIMEOUT_INPUT_DEBOUNCE} from '../constants';

const DEBOUNCE_OPTIONS = {leading: false};
// TODO this does not work because we do not render on an empty input

const makeSubstringSuggestions =
	(useCollectionFind, $nin: string[] = [], key = 'name', filter?) =>
	(searchString) => {
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
		const fields = {
			...sort,
			_id: 1,
			[key]: 1,
		};

		const options = {
			fields,
			sort,
			skip: 0,
			limit,
		};

		const {loading, ...rest} = useCollectionFind(query, options, [
			$regex,
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
