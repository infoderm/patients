import React, {useState} from 'react';

import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';

import type PropsOf from '../../lib/types/PropsOf';

import FixedFab from '../button/FixedFab';

import {normalizeSearch} from '../../api/string';
import mergeFields from '../../api/query/mergeFields';

import Refresh from '../navigation/Refresh';
import {type PatientCacheResult} from '../../api/collection/patients/search/cache';
import type Selector from '../../api/Selector';
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

	const selector: Selector<PatientCacheResult> = {
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
	};
	const fields = mergeFields(
		Object.fromEntries(Object.keys(sort).map((key) => [key, 1])),
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
		[$search, showDead, page, perpage, refreshKey],
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
