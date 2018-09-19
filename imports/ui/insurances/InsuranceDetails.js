import React from 'react' ;
import PropTypes from 'prop-types';

import TagDetails from '../tags/TagDetails.js';

import PagedPatientsList from '../patients/PagedPatientsList.js';

import { Patients } from '../../api/patients.js';

export default function InsuranceDetails ( { match , name , page , perpage } ) {

	name = match && match.params.name || name ;
	page = match && match.params.page && parseInt(match.params.page,10) || page ;

	return (
		<TagDetails
			root="/insurance"
			name={name}
			page={page}
			perpage={perpage}
			collection={Patients}
			subscription="patients-of-insurance"
			selector={{insurance: name}}
			sort={{lastname: 1}}
			List={PagedPatientsList}
		/>
	) ;

}

InsuranceDetails.defaultProps = {
	page: 0,
	perpage: 10,
} ;

InsuranceDetails.propTypes = {
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
} ;
