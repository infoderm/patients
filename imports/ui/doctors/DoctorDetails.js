import React from 'react' ;
import PropTypes from 'prop-types';

import TagDetails from '../tags/TagDetails.js';

import PagedPatientsList from '../patients/PagedPatientsList.js';

import { Patients } from '../../api/patients.js';

export default function DoctorDetails ( { match , page , perpage } ) {

	page = match && match.params.page && parseInt(match.params.page,10) || page ;

	return (
		<TagDetails
			root="/doctor"
			name={name}
			page={page}
			perpage={perpage}
			collection={Patients}
			subscription="patients-of-doctor"
			selector={{doctor: name}}
			sort={{lastname: 1}}
			List={PagedPatientsList}
		/>
	) ;

}

DoctorDetails.defaultProps = {
	page: 0,
	perpage: 10,
} ;

DoctorDetails.propTypes = {
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
} ;
