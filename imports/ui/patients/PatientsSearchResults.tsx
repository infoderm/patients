import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import {useSnackbar} from 'notistack';

import call from '../../api/endpoint/call';
import find from '../../api/endpoint/patients/find';

import {myDecodeURIComponent} from '../../lib/uri';
import mergeFields from '../../api/query/mergeFields';

import {type PatientDocument} from '../../api/collection/patients';
import type Options from '../../api/query/Options';

import StaticPatientsList from './StaticPatientsList';
import ReactivePatientCard from './ReactivePatientCard';

type Params = {
	query: string;
	page?: string;
};

type Props = {
	readonly defaultPage?: number;
	readonly defaultPerpage?: number;
};

const PatientsSearchResults = ({
	defaultPage = 1,
	defaultPerpage = 10,
	...rest
}: Props) => {
	const params = useParams<Params>();
	const page = Number.parseInt(params.page ?? '', 10) || defaultPage;
	const perpage = defaultPerpage;

	const {enqueueSnackbar} = useSnackbar();
	const [loading, setLoading] = useState(true);
	const [patients, setPatients] = useState<Array<{_id: string}>>([]);

	const $search = myDecodeURIComponent(params.query) ?? '';

	useEffect(() => {
		const selector = {$text: {$search}};

		const sort = {
			score: {$meta: 'textScore'},
		} as const;
		const fields = mergeFields<PatientDocument>(
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
		} as Options<PatientDocument>;

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

	return (
		<StaticPatientsList
			page={page}
			perpage={perpage}
			loading={loading}
			patients={patients}
			Card={ReactivePatientCard}
			{...rest}
		/>
	);
};

export default PatientsSearchResults;
