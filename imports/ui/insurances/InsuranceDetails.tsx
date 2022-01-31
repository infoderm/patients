import React from 'react';
import {useParams} from 'react-router-dom';

import TagDetails from '../tags/TagDetails';

import {myEncodeURIComponent, myDecodeURIComponent} from '../../util/uri';

import useObservedPatients from '../patients/useObservedPatients';
import PagedPatientsList from '../patients/PagedPatientsList';

import {useInsurance} from '../../api/insurances';
import StaticInsuranceCard from './StaticInsuranceCard';

interface Props {
	defaultPage?: number;
	defaultPerpage?: number;
}

const InsuranceDetails = ({defaultPage = 1, defaultPerpage = 10}: Props) => {
	const params = useParams<{name: string; page?: string}>();
	const name = myDecodeURIComponent(params.name);
	const page = Number.parseInt(params.page, 10) || defaultPage;
	const perpage = defaultPerpage;

	return (
		<TagDetails
			Card={StaticInsuranceCard}
			useItem={useInsurance}
			name={name}
			List={PagedPatientsList}
			root={`/insurance/${myEncodeURIComponent(name)}`}
			useParents={useObservedPatients}
			selector={{insurances: name}}
			sort={{lastname: 1}}
			fields={PagedPatientsList.projection}
			page={page}
			perpage={perpage}
		/>
	);
};

export default InsuranceDetails;
