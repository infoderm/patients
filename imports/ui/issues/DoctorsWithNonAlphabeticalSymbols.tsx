import React from 'react';

import {useDoctors} from '../../api/doctors';
import TagGrid from '../tags/TagGrid';
import StaticDoctorCard from '../doctors/StaticDoctorCard';

const DoctorsWithNonAlphabeticalSymbols = (props) => {
	const query = {
		filter: {containsNonAlphabetical: true},
	};
	const {loading, results: tags} = useDoctors(query, []);

	if (loading) {
		return <div {...props}>Loading...</div>;
	}

	if (tags.length === 0) {
		return (
			<div {...props}>All doctors are made of alphabetical symbols only :)</div>
		);
	}

	return <TagGrid {...props} Card={StaticDoctorCard} tags={tags} />;
};

export default DoctorsWithNonAlphabeticalSymbols;
