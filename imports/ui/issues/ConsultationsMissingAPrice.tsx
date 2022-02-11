import React from 'react';

import {useConsultationsMissingAPrice} from '../../api/issues';

import ReactiveConsultationCard from '../consultations/ReactiveConsultationCard';
import ReactivePatientChip from '../patients/ReactivePatientChip';

const ConsultationsMissingAPrice = (props) => {
	const {loading, results: consultations} = useConsultationsMissingAPrice({
		isDone: true,
		$or: [{price: {$not: {$type: 1}}}, {price: Number.NaN}],
	});

	if (loading) {
		return <div {...props}>Loading...</div>;
	}

	if (consultations.length === 0) {
		return <div {...props}>All consultations have a price :)</div>;
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

export default ConsultationsMissingAPrice;
