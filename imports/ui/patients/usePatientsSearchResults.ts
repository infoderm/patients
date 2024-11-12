import {normalizeSearch} from '../../api/string';
import mergeFields from '../../api/query/mergeFields';

import type UserFilter from '../../api/query/UserFilter';
import {type PatientSearchIndexDocument} from '../../api/collection/patients/search';

import useAdvancedObservedPatients from './useAdvancedObservedPatients';
import StaticPatientsList from './StaticPatientsList';

type Props = {
	readonly query: string;
	readonly showDead: boolean;
	readonly page?: number;
	readonly perpage?: number;
	readonly refreshKey?: number | string;
};

const usePatientsSearchResults = ({
	query,
	showDead = false,
	page = 1,
	perpage = 5,
	refreshKey = undefined,
}: Props) => {
	const $search = normalizeSearch(query);

	const filter: UserFilter<PatientSearchIndexDocument> = {
		$text: {$search},
		deathdateModifiedAt: showDead ? undefined : {$not: {$type: 'date'}},
	};

	const sort = {
		score: {$meta: 'textScore'},
		deathdateModifiedAt: -1,
		lastModifiedAt: -1,
		lastname: 1,
		firstname: 1,
		birthdate: 1,
		sex: 1,
		niss: 1,
	} as const;

	const projection = mergeFields<PatientSearchIndexDocument>(
		sort,
		StaticPatientsList.projection,
		// We fetch the picture through a dedicated subscription to get live
		// updates while avoiding double loading on init.
		// Additionally, the photo is not available in the search index.
		// @ts-expect-error This is intentional because StaticPatientsList.projection
		// contains key 'photo'.
		{photo: 0},
	);

	const concreteQuery = {
		filter,
		projection,
		sort,
		skip: (page - 1) * perpage,
		limit: perpage,
	};

	const deps = [$search, showDead, page, perpage, refreshKey];

	return useAdvancedObservedPatients(
		concreteQuery,
		deps,
	);

};

export default usePatientsSearchResults;
