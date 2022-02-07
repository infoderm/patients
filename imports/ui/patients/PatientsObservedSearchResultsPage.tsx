import React from 'react';

import {normalizeSearch} from '../../api/string';
import mergeFields from '../../util/mergeFields';

import Refresh from '../navigation/Refresh';
import PropsOf from '../../util/PropsOf';
import useAdvancedObservedPatients from './useAdvancedObservedPatients';
import StaticPatientsList from './StaticPatientsList';
import ReactivePatientCard from './ReactivePatientCard';

type Props = {
	query: string;
	page?: number;
	perpage?: number;
	refresh: () => void;
	refreshKey: number | string;
} & Omit<
	PropsOf<typeof StaticPatientsList>,
	'page' | 'perpage' | 'loading' | 'patients' | 'root' | 'Card'
>;

const PatientsObservedSearchResults = ({
	query,
	page = 1,
	perpage = 5,
	refresh = undefined,
	refreshKey = undefined,
	...rest
}: Props) => {
	const $search = normalizeSearch(query);

	const selector = {$text: {$search}};

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
		StaticPatientsList.projection,
		// We fetch the picture through a dedicated subscription to get live
		// updates while avoiding double loading on init.
		{photo: 0},
	);
	const options = {
		fields,
		sort,
		skip: (page - 1) * perpage,
		limit: perpage,
	};

	const {loading, results, dirty} = useAdvancedObservedPatients(
		selector,
		options,
		[$search, page, perpage, refreshKey],
	);

	return (
		<>
			<StaticPatientsList
				page={page}
				perpage={perpage}
				loading={loading}
				patients={results}
				Card={ReactivePatientCard}
				{...rest}
			/>
			{refresh && dirty && <Refresh onClick={refresh} />}
		</>
	);
};

export default PatientsObservedSearchResults;
