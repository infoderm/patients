import React, {useState} from 'react';

import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';

import type PropsOf from '../../lib/types/PropsOf';

import FixedFab from '../button/FixedFab';

import Refresh from '../navigation/Refresh';

import StaticPatientsList from './StaticPatientsList';
import ReactivePatientCard from './ReactivePatientCard';
import usePatientsSearchResults from './usePatientsSearchResults';

type Props = {
	readonly query: string;
	readonly page?: number;
	readonly perpage?: number;
	readonly refresh?: () => void;
	readonly refreshKey?: number | string;
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

	const {loading, results, dirty} = usePatientsSearchResults({
		query,
		showDead,
		page,
		perpage,
		refreshKey,
	});

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
