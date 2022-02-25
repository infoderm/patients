import React from 'react';

import {useCachedDoctor} from '../../api/doctors';
import {TagNameFields} from '../../api/tags/TagDocument';

import StaticDoctorCard from './StaticDoctorCard';

interface Props {
	item: TagNameFields;
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
