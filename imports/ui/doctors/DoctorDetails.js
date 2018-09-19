import React from 'react' ;
import PropTypes from 'prop-types';

import TagDetails from '../tags/TagDetails.js';

import PagedPatientsList from '../patients/PagedPatientsList.js';

import { Patients } from '../../api/patients.js';

export default function DoctorDetails ( { match } ) {

	const name = match.params.name ;
	const page = ( match.params.page && parseInt(match.params.page, 10) ) || 0 ;
	const perpage = 10 ;

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

DoctorDetails.propTypes = {
	match: PropTypes.object.isRequired,
} ;

