import React from 'react';
import PropTypes from 'prop-types';

import {myDecodeURIComponent} from '../../client/uri.js';
import {normalizeSearch} from '../../api/string.js';
import mergeFields from '../../util/mergeFields.js';

import Refresh from '../navigation/Refresh.js';
import StaticPatientsList from './StaticPatientsList.js';
import ReactivePatientCard from './ReactivePatientCard.js';

import {usePatientsAdvancedFind} from '../../api/patients.js';

const PatientsObservedSearchResults = (props) => {
	let {match, page, perpage, refresh, refreshKey, ...rest} = props;
	page =
		(match && match.params.page && Number.parseInt(match.params.page, 10)) ||
		page ||
		PatientsObservedSearchResults.defaultProps.page;
	perpage = perpage || PatientsObservedSearchResults.defaultProps.perpage;

	const $search = normalizeSearch(myDecodeURIComponent(match.params.query));

	const query = {$text: {$search}};

	const sort = {
		score: {$meta: 'textScore'}
	};
	const fields = mergeFields(
		sort,
		StaticPatientsList.projection,
		// We fetch the picture through a dedicated subscription to get live
		// updates while avoiding double loading on init.
		{photo: 0}
	);
	const options = {
		fields,
		sort,
		skip: (page - 1) * perpage,
		limit: perpage
	};

	const {loading, results, dirty} = usePatientsAdvancedFind(query, options, [
		$search,
		page,
		perpage,
		refreshKey
	]);

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
	perpage: 10,
	refresh: undefined,
	refreshKey: undefined
};

PatientsObservedSearchResults.propTypes = {
	page: PropTypes.number,
	perpage: PropTypes.number,
	refresh: PropTypes.func,
	refreshKey: PropTypes.any
};

export default PatientsObservedSearchResults;
