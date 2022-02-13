import React from 'react';

import {useConsultationsWithPriceZeroNotInBookZero} from '../../api/issues';

import ReactiveConsultationCard from '../consultations/ReactiveConsultationCard';
import ReactivePatientChip from '../patients/ReactivePatientChip';

const ConsultationsWithPriceZeroNotInBookZero = (props) => {
	const {loading, results: consultations} =
		useConsultationsWithPriceZeroNotInBookZero();

	if (loading) {
		return <div {...props}>Loading...</div>;
	}

	if (consultations.length === 0) {
		return <div {...props}>All price 0 consultations are in book 0 :)</div>;
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

export default ConsultationsWithPriceZeroNotInBookZero;
