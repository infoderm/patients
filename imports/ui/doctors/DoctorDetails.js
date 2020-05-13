import React from 'react' ;
import PropTypes from 'prop-types';

import TagDetails from '../tags/TagDetails.js';

import PagedPatientsList from '../patients/PagedPatientsList.js';

import { Patients } from '../../api/patients.js';
import { doctors } from '../../api/doctors.js';

import { DoctorCardWithItem } from './DoctorCard.js';

import { myEncodeURIComponent } from '../../client/uri.js';
import { myDecodeURIComponent } from '../../client/uri.js';

export default function DoctorDetails ( { match , name , page , perpage } ) {

	name = match && myDecodeURIComponent(match.params.name) || name ;
	page = match && match.params.page && parseInt(match.params.page,10) || page ;

	return (
		<TagDetails
			root={`/doctor/${myEncodeURIComponent(name)}`}
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
	page: 1,
	perpage: 10,
} ;

DoctorDetails.propTypes = {
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
} ;
