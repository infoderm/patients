import React from 'react';

import ConsultationsPager from '../consultations/ConsultationsPager';

import ReactivePatientChip from '../patients/ReactivePatientChip';

const filter = {
	isDone: true,
	$or: [{book: null!}, {book: ''}],
};

const sort = {
	datetime: -1,
};

const ConsultationsMissingABook = (props) => {
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

export default ConsultationsMissingABook;
