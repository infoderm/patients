import React from 'react';

import useDoctor from './useDoctor';

import StaticDoctorCard from './StaticDoctorCard';

const ReactiveDoctorCard = ({name}) => {
	const {loading, item} = useDoctor(name, [name]);
	return <StaticDoctorCard loading={loading} item={item} />;
};

export default ReactiveDoctorCard;
