import React from 'react' ;
import PropTypes from 'prop-types';

import TagDetails from '../tags/TagDetails.js';

import PagedPatientsList from '../patients/PagedPatientsList.js';

import { Patients } from '../../api/patients.js';
import { doctors } from '../../api/doctors.js';

import { DoctorCardWithItem } from './DoctorCard.js';

import { myDecodeURIComponent } from '../../client/uri.js';

export default function DoctorDetails ( { match , name , page , perpage } ) {

	name = match && match.params.name || name ;
	page = match && match.params.page && parseInt(match.params.page,10) || page ;

	name = myDecodeURIComponent(name);

	return (
		<TagDetails
			root="/doctor"
			name={name}
			page={page}
			perpage={perpage}
			collection={Patients}
			subscription={doctors.options.parentPublication}
			selector={{doctors: name}}
			sort={{lastname: 1}}
			List={PagedPatientsList}
			Card={DoctorCardWithItem}
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
