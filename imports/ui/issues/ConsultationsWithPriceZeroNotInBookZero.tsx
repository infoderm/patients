import React from 'react';

import ConsultationsPager from '../consultations/ConsultationsPager';

import ReactivePatientChip from '../patients/ReactivePatientChip';

const filter = {
	isDone: true,
	price: 0,
	book: {$ne: '0'},
};

const sort = {
	datetime: -1,
};

const ConsultationsWithPriceZeroNotInBookZero = (props) => {
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

export default ConsultationsWithPriceZeroNotInBookZero;
