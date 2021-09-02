import React from 'react';

import useCachedDoctor from './useCachedDoctor';

import StaticDoctorCard from './StaticDoctorCard';

const ReactiveDoctorCard = ({item}) => {
	const init = {...item};
	const {name} = item;
	const query = {name};
	const options = {};
	const deps = [name];
	const {loading, found, fields} = useCachedDoctor(init, query, options, deps);
	return <StaticDoctorCard loading={loading} found={found} item={fields} />;
};

export default ReactiveDoctorCard;
