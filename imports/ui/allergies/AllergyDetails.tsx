import React from 'react';
import {useParams} from 'react-router-dom';

import TagDetails from '../tags/TagDetails';

import {myEncodeURIComponent, myDecodeURIComponent} from '../../util/uri';

import useObservedPatients from '../patients/useObservedPatients';
import PagedPatientsList from '../patients/PagedPatientsList';

import {useAllergy} from '../../api/allergies';
import StaticAllergyCard from './StaticAllergyCard';

interface Props {
	defaultPage?: number;
	defaultPerpage?: number;
}

const AllergyDetails = ({defaultPage = 1, defaultPerpage = 10}: Props) => {
	const params = useParams<{name: string; page?: string}>();
	const name = myDecodeURIComponent(params.name);
	const page = Number.parseInt(params.page, 10) || defaultPage;
	const perpage = defaultPerpage;

	return (
		<TagDetails
			Card={StaticAllergyCard}
			useItem={useAllergy}
			name={name}
			List={PagedPatientsList}
			root={`/allergy/${myEncodeURIComponent(name)}`}
			useParents={useObservedPatients}
			selector={{allergies: name}}
			sort={{lastname: 1}}
			fields={PagedPatientsList.projection}
			page={page}
			perpage={perpage}
		/>
	);
};

export default AllergyDetails;
