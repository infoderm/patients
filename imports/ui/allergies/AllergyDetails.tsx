import React from 'react';
import PropTypes from 'prop-types';

import TagDetails from '../tags/TagDetails';

import {myEncodeURIComponent, myDecodeURIComponent} from '../../client/uri';

import useObservedPatients from '../patients/useObservedPatients';
import PagedPatientsList from '../patients/PagedPatientsList';

import StaticAllergyCard from './StaticAllergyCard';
import useAllergy from './useAllergy';

export default function AllergyDetails({match, name, page, perpage}) {
	name = (match && myDecodeURIComponent(match.params.name)) || name;
	page = Number.parseInt(match?.params.page, 10) || page;

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
}

AllergyDetails.defaultProps = {
	page: 1,
	perpage: 10,
};

AllergyDetails.propTypes = {
	page: PropTypes.number,
	perpage: PropTypes.number,
};
