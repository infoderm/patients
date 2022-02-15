import React from 'react';

import {useConsultationsMissingPaymentData} from '../../api/issues';

import ReactiveConsultationCard from '../consultations/ReactiveConsultationCard';
import ReactivePatientChip from '../patients/ReactivePatientChip';

const ConsultationsMissingPaymentData = (props) => {
	const {loading, results: consultations} = useConsultationsMissingPaymentData(
		{
			isDone: true,
			datetime: {$gte: new Date(2020, 0, 1)},
			$or: [
				{price: {$not: {$type: 1}}},
				{price: Number.NaN},
				{paid: {$not: {$type: 1}}},
				{paid: Number.NaN},
				{currency: {$not: {$type: 2}}},
				{payment_method: {$not: {$type: 2}}},
			],
		},
		{
			sort: {
				datetime: -1,
			},
		},
	);

	if (loading) {
		return <div {...props}>Loading...</div>;
	}

	if (consultations.length === 0) {
		return <div {...props}>All consultations have payment data :)</div>;
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

export default ConsultationsMissingPaymentData;
