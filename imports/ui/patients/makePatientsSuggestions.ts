import {useDebounce} from 'use-debounce';

import {map} from '@iterable-iterator/map';
import {list} from '@iterable-iterator/list';

import mergeFields from '../../util/mergeFields.js';

import {usePatientsAdvancedFind} from '../../api/patients.js';
import {normalizeSearch} from '../../api/string.js';

import {TIMEOUT_INPUT_DEBOUNCE} from '../constants.js';

const DEBOUNCE_OPTIONS = {leading: false};
// TODO this does not work because we do not render on an empty input

const makePatientsSuggestions = (set = [], userOptions = undefined) => {
	const $nin = list(map((x) => x._id, set));
	return (searchString: string) => {
		const [debouncedSearchString, {isPending, cancel, flush}] = useDebounce(
			searchString,
			TIMEOUT_INPUT_DEBOUNCE,
			DEBOUNCE_OPTIONS
		);

		const $search = normalizeSearch(debouncedSearchString);
		const limit = userOptions?.limit ?? 5;

		const query = {$text: {$search}, _id: {$nin}};

		const sort = {
			score: {$meta: 'textScore'}
		};
		const fields = mergeFields(
			sort,
			{
				_id: 1,
				firstname: 1,
				lastname: 1
			},
			userOptions?.fields
		);

		const options = {
			fields,
			sort,
			skip: 0,
			limit
		};

		const deps = [
			JSON.stringify(query),
			JSON.stringify(options)
			// refreshKey,
		];

		const {loading, ...rest} = usePatientsAdvancedFind(query, options, deps);

		return {
			loading: loading || isPending(),
			cancel,
			flush,
			...rest
		};
	};
};

export default makePatientsSuggestions;
