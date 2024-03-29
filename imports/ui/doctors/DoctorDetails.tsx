import React from 'react';

import TagDetails from '../tags/TagDetails';

import useObservedPatients from '../patients/useObservedPatients';
import PagedPatientsList from '../patients/PagedPatientsList';

import {useDoctor} from '../../api/doctors';

import StaticDoctorCard from './StaticDoctorCard';

type Props = {
	readonly name: string;
	readonly page?: number;
	readonly perpage?: number;
};

const DoctorDetails = ({name, page = 1, perpage = 10}: Props) => {
	return (
		<TagDetails
			Card={StaticDoctorCard}
			useItem={useDoctor}
			name={name}
			List={PagedPatientsList}
			useParents={useObservedPatients}
			filter={{doctors: {$elemMatch: {name}}}}
			sort={{lastname: 1}}
			projection={PagedPatientsList.projection}
			page={page}
			perpage={perpage}
		/>
	);
};

export default DoctorDetails;
