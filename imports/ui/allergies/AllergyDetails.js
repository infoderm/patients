import React from 'react' ;
import PropTypes from 'prop-types';

import TagDetails from '../tags/TagDetails.js';

import PagedPatientsList from '../patients/PagedPatientsList.js';

import { Patients } from '../../api/patients.js';
import { allergies } from '../../api/allergies.js';

import { AllergyCardWithItem } from './AllergyCard.js';

import { myEncodeURIComponent } from '../../client/uri.js';
import { myDecodeURIComponent } from '../../client/uri.js';

export default function AllergyDetails ( { match , name , page , perpage } ) {

	name = match && myDecodeURIComponent(match.params.name) || name ;
	page = match && match.params.page && parseInt(match.params.page,10) || page ;

	return (
		<TagDetails
			root={`/allergy/${myEncodeURIComponent(name)}`}
			name={name}
			page={page}
			perpage={perpage}
			collection={Patients}
			subscription={allergies.options.parentPublication}
			selector={{allergies: name}}
			sort={{lastname: 1}}
			List={PagedPatientsList}
			Card={AllergyCardWithItem}
		/>
	) ;

}

AllergyDetails.defaultProps = {
	page: 1,
	perpage: 10,
} ;

AllergyDetails.propTypes = {
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
} ;
