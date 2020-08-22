import {Meteor} from 'meteor/meteor';

import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import {useSnackbar} from 'notistack';
import {myDecodeURIComponent} from '../../client/uri.js';

import StaticPatientsList from './StaticPatientsList.js';
import ReactivePatientCard from './ReactivePatientCard.js';

const PatientsSearchResults = ({match, page, perpage, ...rest}) => {
	page =
		(match && match.params.page && Number.parseInt(match.params.page, 10)) ||
		page ||
		PatientsSearchResults.defaultProps.page;
	perpage = perpage || PatientsSearchResults.defaultProps.perpage;

	const {enqueueSnackbar} = useSnackbar();
	const [loading, setLoading] = useState(true);
	const [patients, setPatients] = useState([]);
	const [abortPrevious, setAbortPrevious] = useState(null);

	const $search = myDecodeURIComponent(match.params.query);

	useEffect(() => {
		if (abortPrevious) abortPrevious();

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

		setLoading(true);
		let cancelled = false;
		const abort = () => {
			cancelled = true;
			// enqueueSnackbar(`Aborted query: ${$search}.`, {variant: 'warning'});
		};

		setAbortPrevious(() => abort);
		Meteor.call('patients.find', query, options, (err, res) => {
			if (!cancelled) {
				setAbortPrevious(null); // GC
				setLoading(false);
				if (err) {
					console.log('err', err);
					enqueueSnackbar(`${err.message} (query: ${$search})`, {
						variant: 'error'
					});
				} else {
					setPatients(res);
				}
			}
		});
	}, [$search, page, perpage]);

	const root = `/search/${match.params.query}`;

	return (
		<StaticPatientsList
			page={page}
			perpage={perpage}
			loading={loading}
			patients={patients}
			root={root}
			Card={ReactivePatientCard}
			{...rest}
		/>
	);
};

PatientsSearchResults.defaultProps = {
	page: 1,
	perpage: 10
};

PatientsSearchResults.propTypes = {
	page: PropTypes.number,
	perpage: PropTypes.number
};

export default PatientsSearchResults;
