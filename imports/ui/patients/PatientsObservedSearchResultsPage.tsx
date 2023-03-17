import React, {useState} from 'react';

import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';

import type PropsOf from '../../lib/types/PropsOf';

import FixedFab from '../button/FixedFab';

import {normalizeSearch} from '../../api/string';
import mergeFields from '../../api/query/mergeFields';

import Refresh from '../navigation/Refresh';
import type UserFilter from '../../api/query/UserFilter';
import {type PatientSearchIndexDocument} from '../../api/collection/patients/search';
import useAdvancedObservedPatients from './useAdvancedObservedPatients';
import StaticPatientsList from './StaticPatientsList';
import ReactivePatientCard from './ReactivePatientCard';

type Props = {
	query: string;
	page?: number;
	perpage?: number;
	refresh?: () => void;
	refreshKey?: number | string;
} & Omit<
	PropsOf<typeof StaticPatientsList>,
	'page' | 'perpage' | 'loading' | 'patients' | 'root' | 'Card'
>;

const PatientsObservedSearchResultsPage = ({
	query,
	page = 1,
	perpage = 5,
	refresh = undefined,
	refreshKey = undefined,
	...rest
}: Props) => {
	const [showDead, setShowDead] = useState(false);
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

	const {loading, results, dirty} = useAdvancedObservedPatients(
		concreteQuery,
		deps,
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
			<FixedFab
				col={4}
				tooltip={showDead ? 'Show alive patients only' : 'Show all patients'}
				color={showDead ? 'default' : 'primary'}
				onClick={() => {
					setShowDead(!showDead);
				}}
			>
				{showDead ? <HeartBrokenIcon /> : <MonitorHeartIcon />}
			</FixedFab>
			{refresh && dirty && <Refresh onClick={refresh} />}
		</>
	);
};

export default PatientsObservedSearchResultsPage;
