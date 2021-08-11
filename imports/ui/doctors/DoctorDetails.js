import React from 'react';
import PropTypes from 'prop-types';

import TagDetails from '../tags/TagDetails';

import PagedPatientsList from '../patients/PagedPatientsList';

import {usePatientsFind} from '../../api/patients';

import {myEncodeURIComponent, myDecodeURIComponent} from '../../client/uri';
import StaticDoctorCard from './StaticDoctorCard';
import useDoctor from './useDoctor';

export default function DoctorDetails({match, name, page, perpage}) {
	name = (match && myDecodeURIComponent(match.params.name)) || name;
	page =
		(match && match.params.page && Number.parseInt(match.params.page, 10)) ||
		page;

	return (
		<TagDetails
			Card={StaticDoctorCard}
			useItem={useDoctor}
			name={name}
			List={PagedPatientsList}
			root={`/doctor/${myEncodeURIComponent(name)}`}
			useParents={usePatientsFind}
			selector={{doctors: name}}
			sort={{lastname: 1}}
			fields={PagedPatientsList.projection}
			page={page}
			perpage={perpage}
		/>
	);
}

DoctorDetails.defaultProps = {
	page: 1,
	perpage: 10,
};

DoctorDetails.propTypes = {
	page: PropTypes.number,
	perpage: PropTypes.number,
};
