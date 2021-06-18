import React from 'react';

import {useDoctors} from '../../api/doctors';
import TagGrid from '../tags/TagGrid';
import DoctorCard from '../doctors/DoctorCard';

const DoctorsWithNonAlphabeticalSymbols = (props) => {
	const query = {containsNonAlphabetical: true};
	const options = {};
	const deps = [];
	const {loading, results: tags} = useDoctors(query, options, deps);

	if (loading) {
		return <div {...props}>Loading...</div>;
	}

	if (tags.length === 0) {
		return (
			<div {...props}>All doctors are made of alphabetical symbols only :)</div>
		);
	}

	return <TagGrid {...props} Card={DoctorCard} tags={tags} />;
};

export default DoctorsWithNonAlphabeticalSymbols;
