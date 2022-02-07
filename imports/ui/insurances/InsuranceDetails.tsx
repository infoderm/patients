import React from 'react';

import TagDetails from '../tags/TagDetails';

import useObservedPatients from '../patients/useObservedPatients';
import PagedPatientsList from '../patients/PagedPatientsList';

import {useInsurance} from '../../api/insurances';
import StaticInsuranceCard from './StaticInsuranceCard';

interface Props {
	name: string;
	page?: number;
	perpage?: number;
}

const InsuranceDetails = ({name, page = 1, perpage = 10}: Props) => {
	return (
		<TagDetails
			Card={StaticInsuranceCard}
			useItem={useInsurance}
			name={name}
			List={PagedPatientsList}
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
