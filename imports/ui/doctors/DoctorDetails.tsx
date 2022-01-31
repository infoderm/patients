import React from 'react';
import {useParams} from 'react-router-dom';

import TagDetails from '../tags/TagDetails';

import {myEncodeURIComponent, myDecodeURIComponent} from '../../util/uri';

import useObservedPatients from '../patients/useObservedPatients';
import PagedPatientsList from '../patients/PagedPatientsList';

import {useDoctor} from '../../api/doctors';
import StaticDoctorCard from './StaticDoctorCard';

interface Props {
	defaultPage?: number;
	defaultPerpage?: number;
}

const DoctorDetails = ({defaultPage = 1, defaultPerpage = 10}: Props) => {
	const params = useParams<{name: string; page?: string}>();
	const name = myDecodeURIComponent(params.name);
	const page = Number.parseInt(params.page, 10) || defaultPage;
	const perpage = defaultPerpage;

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
};

export default DoctorDetails;
