import React from 'react';
import PropTypes from 'prop-types';

import TagDetails from '../tags/TagDetails.js';

import PagedPatientsList from '../patients/PagedPatientsList.js';

import {usePatientsFind} from '../../api/patients.js';

import {InsuranceCardWithoutItem} from './InsuranceCard.js';
import useInsurance from './useInsurance.js';

import {myEncodeURIComponent, myDecodeURIComponent} from '../../client/uri.js';

export default function InsuranceDetails({match, name, page, perpage}) {
	name = (match && myDecodeURIComponent(match.params.name)) || name;
	page =
		(match && match.params.page && Number.parseInt(match.params.page, 10)) ||
		page;

	return (
		<TagDetails
			Card={InsuranceCardWithoutItem}
			useItem={useInsurance}
			name={name}
			List={PagedPatientsList}
			root={`/insurance/${myEncodeURIComponent(name)}`}
			useParents={usePatientsFind}
			selector={{insurances: name}}
			sort={{lastname: 1}}
			fields={PagedPatientsList.projection}
			page={page}
			perpage={perpage}
		/>
	);
}

InsuranceDetails.defaultProps = {
	page: 1,
	perpage: 10
};

InsuranceDetails.propTypes = {
	page: PropTypes.number,
	perpage: PropTypes.number
};
