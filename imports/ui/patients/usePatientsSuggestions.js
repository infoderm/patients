import {useDebounce} from 'use-debounce';
import {usePatientsAdvancedFind} from '../../api/patients.js';
import {normalizeSearch} from '../../api/string.js';

import {TIMEOUT_INPUT_DEBOUNCE} from '../constants.js';

const DEBOUNCE_OPTIONS = {leading: false};
// TODO this does not work because we do not render on an empty input

const usePatientsSuggestions = (searchString) => {
	const [debouncedSearchString, {pending, cancel, flush}] = useDebounce(
		searchString,
		TIMEOUT_INPUT_DEBOUNCE,
		DEBOUNCE_OPTIONS
	);

	const $search = normalizeSearch(debouncedSearchString);
	const limit = 5;

	const query = {$text: {$search}};

	const sort = {
		score: {$meta: 'textScore'}
	};
	const fields = {
		...sort,
		_id: 1,
		firstname: 1,
		lastname: 1
	};

	const options = {
		fields,
		sort,
		skip: 0,
		limit
	};

	const {loading, ...rest} = usePatientsAdvancedFind(query, options, [
		$search
		// refreshKey,
	]);

	return {
		loading: loading || pending(),
		cancel,
		flush,
		...rest
	};
};

export default usePatientsSuggestions;
