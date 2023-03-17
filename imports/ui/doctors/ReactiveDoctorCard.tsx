import React from 'react';

import {useCachedDoctor} from '../../api/doctors';
import {type TagNameFields} from '../../api/tags/TagDocument';

import StaticDoctorCard from './StaticDoctorCard';

type Props = {
	item: TagNameFields;
};

const ReactiveDoctorCard = ({item}: Props) => {
	const init = {...item};
	const {name} = item;
	const query = {filter: {name}};
	const deps = [name];
	const {loading, found, fields} = useCachedDoctor(init, query, deps);
	return <StaticDoctorCard loading={loading} found={found} item={fields} />;
};

export default ReactiveDoctorCard;
