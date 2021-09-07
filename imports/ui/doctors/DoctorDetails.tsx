import React from 'react';
import PropTypes from 'prop-types';

import TagDetails from '../tags/TagDetails';

import {myEncodeURIComponent, myDecodeURIComponent} from '../../client/uri';

import useObservedPatients from '../patients/useObservedPatients';
import PagedPatientsList from '../patients/PagedPatientsList';

import {useDoctor} from '../../api/doctors';
import StaticDoctorCard from './StaticDoctorCard';

export default function DoctorDetails({match, name, page, perpage}) {
	name = (match && myDecodeURIComponent(match.params.name)) || name;
	page = Number.parseInt(match?.params.page, 10) || page;

	return (
		<TagDetails
			Card={StaticDoctorCard}
			useItem={useDoctor}
			name={name}
			List={PagedPatientsList}
			root={`/doctor/${myEncodeURIComponent(name)}`}
			useParents={useObservedPatients}
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
