import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import {useSnackbar} from 'notistack';

import call from '../../api/endpoint/call';
import find from '../../api/endpoint/patients/find';

import {myDecodeURIComponent} from '../../util/uri';
import mergeFields from '../../util/mergeFields';

import StaticPatientsList from './StaticPatientsList';
import ReactivePatientCard from './ReactivePatientCard';

interface Params {
	query: string;
	page?: string;
}

interface Props {
	defaultPage?: number;
	defaultPerpage?: number;
}

const PatientsSearchResults = ({
	defaultPage = 1,
	defaultPerpage = 10,
	...rest
}: Props) => {
	const params = useParams<Params>();
	const page = Number.parseInt(params.page, 10) || defaultPage;
	const perpage = defaultPerpage;

	const {enqueueSnackbar} = useSnackbar();
	const [loading, setLoading] = useState(true);
	const [patients, setPatients] = useState([]);

	const $search = myDecodeURIComponent(params.query);

	useEffect(() => {
		const selector = {$text: {$search}};

		const sort = {
			score: {$meta: 'textScore'},
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

		setLoading(true);
		let cancelled = false;

		call(find, selector, options).then(
			(res) => {
				if (!cancelled) {
					setLoading(false);
					setPatients(res);
				}
			},
			(error) => {
				if (!cancelled) {
					setLoading(false);
					console.log('err', error);
					enqueueSnackbar(`${error.message} (query: ${$search})`, {
						variant: 'error',
					});
				}
			},
		);

		return () => {
			cancelled = true;
			// enqueueSnackbar(`Aborted query: ${$search}.`, {variant: 'warning'});
		};
	}, [$search, page, perpage, enqueueSnackbar]);

	const root = `/search/${params.query}`;

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

export default PatientsSearchResults;
