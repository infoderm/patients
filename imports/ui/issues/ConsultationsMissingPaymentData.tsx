import React from 'react';

import ConsultationsPager from '../consultations/ConsultationsPager';

import ReactivePatientChip from '../patients/ReactivePatientChip';

const filter = {
	isDone: true,
	datetime: {$gte: new Date(2020, 0, 1)},
	$or: [
		{price: {$exists: false}},
		{price: {$not: {$type: 1}}},
		{price: Number.NaN},
		{price: {$exists: false}},
		{paid: {$not: {$type: 1}}},
		{paid: Number.NaN},
		{currency: {$exists: false}},
		{currency: {$not: {$type: 2}}},
		{payment_method: {$exists: false}},
		{payment_method: {$not: {$type: 2}}},
	],
};

const sort = {
	datetime: -1,
};

const ConsultationsMissingPaymentData = (props) => {
	return (
		<div {...props}>
			<ConsultationsPager
				filter={filter}
				sort={sort}
				itemProps={{
					PatientChip: ReactivePatientChip,
				}}
			/>
		</div>
	);
};

export default ConsultationsMissingPaymentData;
