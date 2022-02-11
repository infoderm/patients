import React from 'react';

import {useConsultationsMissingABook} from '../../api/issues';

import ReactiveConsultationCard from '../consultations/ReactiveConsultationCard';
import ReactivePatientChip from '../patients/ReactivePatientChip';

const ConsultationsMissingABook = (props) => {
	const {loading, results: consultations} = useConsultationsMissingABook();

	if (loading) {
		return <div {...props}>Loading...</div>;
	}

	if (consultations.length === 0) {
		return <div {...props}>All consultations have a book :)</div>;
	}

	return (
		<div {...props}>
			{consultations.map((consultation) => (
				<ReactiveConsultationCard
					key={consultation._id}
					consultation={consultation}
					PatientChip={ReactivePatientChip}
				/>
			))}
		</div>
	);
};

export default ConsultationsMissingABook;
