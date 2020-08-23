import {Meteor} from 'meteor/meteor';

import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

import {myDecodeURIComponent} from '../../client/uri.js';

import Refresh from '../navigation/Refresh.js';
import StaticPatientsList from './StaticPatientsList.js';
import ReactivePatientCard from './ReactivePatientCard.js';

import {PatientsCache} from '../../api/patients.js';

const PatientsObservedSearchResults = (props) => {
	let {match, page, perpage, refresh, refreshKey, ...rest} = props;
	page =
		(match && match.params.page && Number.parseInt(match.params.page, 10)) ||
		page ||
		PatientsObservedSearchResults.defaultProps.page;
	perpage = perpage || PatientsObservedSearchResults.defaultProps.perpage;

	const $search = myDecodeURIComponent(match.params.query);
	const [loading, setLoading] = useState(true);
	const [results, setResults] = useState([]);
	const [dirty, setDirty] = useState(false);
	const handleRef = useRef(null);

	useEffect(() => {
		setDirty(false);

		const query = {$text: {$search}};

		const sort = {
			score: {$meta: 'textScore'}
		};
		const fields = {
			...sort,
			...StaticPatientsList.projection
		};
		// We fetch the picture through a dedicated subscription to get live
		// updates while avoiding double loading on init.
		delete fields.photo;
		const options = {
			fields,
			sort,
			skip: (page - 1) * perpage,
			limit: perpage
		};

		const timestamp = new Date().getTime();
		const key = JSON.stringify({timestamp, query, options});
		const handle = Meteor.subscribe(
			'patients.find.observe',
			key,
			query,
			options,
			{
				onStop: () => {
					if (handleRef.current === handle) setDirty(true);
				},
				onReady: () => {
					const {results} = PatientsCache.findOne({key});
					setLoading(false);
					setResults(results);
				}
			}
		);
		handleRef.current = handle;

		return () => {
			handle.stop();
		};
	}, [$search, page, perpage, refreshKey]);

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
