import React from 'react';

import TagDetails from '../tags/TagDetails';

import useObservedPatients from '../patients/useObservedPatients';
import PagedPatientsList from '../patients/PagedPatientsList';

import {useAllergy} from '../../api/allergies';
import StaticAllergyCard from './StaticAllergyCard';

interface Props {
	name: string;
	page?: number;
	perpage?: number;
}

const AllergyDetails = ({name, page = 1, perpage = 10}: Props) => {
	return (
		<TagDetails
			Card={StaticAllergyCard}
			useItem={useAllergy}
			name={name}
			List={PagedPatientsList}
			useParents={useObservedPatients}
			selector={{allergies: {$elemMatch: {name}}}}
			sort={{lastname: 1}}
			fields={PagedPatientsList.projection}
			page={page}
			perpage={perpage}
		/>
	);
};

export default AllergyDetails;
