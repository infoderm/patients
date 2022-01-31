import React from 'react';

import {useCachedDoctor} from '../../api/doctors';

import StaticDoctorCard from './StaticDoctorCard';

interface Props {
	item: {name: string};
}

const ReactiveDoctorCard = ({item}: Props) => {
	const init = {...item};
	const {name} = item;
	const query = {name};
	const options = {};
	const deps = [name];
	const {loading, found, fields} = useCachedDoctor(init, query, options, deps);
	return <StaticDoctorCard loading={loading} found={found} item={fields} />;
};

export default ReactiveDoctorCard;
