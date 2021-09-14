import React from 'react';
import PropTypes from 'prop-types';

import {myDecodeURIComponent} from '../../client/uri';
import {normalizeSearch} from '../../api/string';
import mergeFields from '../../util/mergeFields';

import Refresh from '../navigation/Refresh';
import PropsOf from '../../util/PropsOf';
import useAdvancedObservedPatients from './useAdvancedObservedPatients';
import StaticPatientsList from './StaticPatientsList';
import ReactivePatientCard from './ReactivePatientCard';

type Props = {
	match: any;
	page?: number;
	perpage?: number;
	refresh: () => void;
	refreshKey: number | string;
} & Omit<
	PropsOf<typeof StaticPatientsList>,
	'page' | 'perpage' | 'loading' | 'patients' | 'root' | 'Card'
>;

const PatientsObservedSearchResults = (props: Props) => {
	let {match, page, perpage, refresh, refreshKey, ...rest} = props;
	page =
		(match?.params.page && Number.parseInt(match.params.page, 10)) ||
		page ||
		PatientsObservedSearchResults.defaultProps.page;
	perpage = perpage || PatientsObservedSearchResults.defaultProps.perpage;

	const $search = normalizeSearch(myDecodeURIComponent(match.params.query));

	const query = {$text: {$search}};

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
		query,
		options,
		[$search, page, perpage, refreshKey],
	);

	const root = `/search/${match.params.query}`;

	return (
		<>
			<StaticPatientsList
				page={page}
				perpage={perpage}
				loading={loading}
				patients={results}
				root={root}
				Card={ReactivePatientCard}
				{...rest}
			/>
			{refresh && dirty && <Refresh onClick={refresh} />}
		</>
	);
};

PatientsObservedSearchResults.defaultProps = {
	page: 1,
	perpage: 5,
	refresh: undefined,
	refreshKey: undefined,
};

PatientsObservedSearchResults.propTypes = {
	page: PropTypes.number,
	perpage: PropTypes.number,
	refresh: PropTypes.func,
	refreshKey: PropTypes.any,
};

export default PatientsObservedSearchResults;
