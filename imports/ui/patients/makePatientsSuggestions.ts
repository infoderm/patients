import {useDebounce} from 'use-debounce';

import {map} from '@iterable-iterator/map';
import {list} from '@iterable-iterator/list';

import mergeFields from '../../api/query/mergeFields';

import {normalizeSearch} from '../../api/string';

import {TIMEOUT_INPUT_DEBOUNCE} from '../constants';
import type Options from '../../api/Options';
import {type PatientCacheItem} from '../../api/collection/patients/search/cache';
import useAdvancedObservedPatients from './useAdvancedObservedPatients';

const DEBOUNCE_OPTIONS = {leading: false};
// TODO this does not work because we do not render on an empty input

const makePatientsSuggestions = (
	set = [],
	userOptions?: Options<PatientCacheItem>,
) => {
	const $nin = list(map((x) => x._id, set));
	return (searchString: string) => {
		const [debouncedSearchString, {isPending, cancel, flush}] = useDebounce(
			searchString,
			TIMEOUT_INPUT_DEBOUNCE,
			DEBOUNCE_OPTIONS,
		);

		const $search = normalizeSearch(debouncedSearchString);
		const limit = userOptions?.limit ?? 5;

		const query = {$text: {$search}, _id: {$nin}};

		const sort = {
			score: {$meta: 'textScore'},
			lastModifiedAt: -1,
			lastname: 1,
			firstname: 1,
			birthdate: 1,
			sex: 1,
			niss: 1,
		};
		const fields = mergeFields(
			sort,
			{
				_id: 1,
				firstname: 1,
				lastname: 1,
			},
			userOptions?.fields,
		);

		const options = {
			fields,
			sort,
			skip: 0,
			limit,
		};

		const deps = [
			JSON.stringify(query),
			JSON.stringify(options),
			// refreshKey,
		];

		const {loading, ...rest} = useAdvancedObservedPatients(
			query,
			options,
			deps,
		);

		return {
			loading: Boolean(loading) || isPending(),
			cancel,
			flush,
			...rest,
		};
	};
};

export default makePatientsSuggestions;
