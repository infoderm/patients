import React from 'react' ;
import PropTypes from 'prop-types';

import TagDetails from '../tags/TagDetails.js';

import PagedPatientsList from '../patients/PagedPatientsList.js';

import { Patients } from '../../api/patients.js';
import { insurances } from '../../api/insurances.js';

import { InsuranceCardWithItem } from './InsuranceCard.js';

import { myDecodeURIComponent } from '../../client/uri.js';

export default function InsuranceDetails ( { match , name , page , perpage } ) {

	name = match && match.params.name || name ;
	page = match && match.params.page && parseInt(match.params.page,10) || page ;

	name = myDecodeURIComponent(name);

	return (
		<TagDetails
			root="/insurance"
			name={name}
			page={page}
			perpage={perpage}
			collection={Patients}
			subscription={insurances.options.parentPublication}
			selector={{insurances: name}}
			sort={{lastname: 1}}
			List={PagedPatientsList}
			Card={InsuranceCardWithItem}
		/>
	) ;

}

InsuranceDetails.defaultProps = {
	page: 1,
	perpage: 10,
} ;

InsuranceDetails.propTypes = {
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
} ;
