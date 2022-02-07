import React from 'react';

import NoContent from '../navigation/NoContent';

import ReactiveConsultationCard from '../consultations/ReactiveConsultationCard';

interface Props {
	patientId: string;
	appointments: Array<{_id: string}>;
	page: number;
}

const AppointmentsForPatientStatic = ({
	patientId,
	appointments,
	page,
	...rest
}: Props) => (
	<>
		{appointments.length === 0 && (
			<NoContent>Nothing to see on page {page}.</NoContent>
		)}
		<div {...rest}>
			{appointments.map((appointment, i) => (
				<ReactiveConsultationCard
					key={appointment._id}
					consultation={appointment}
					defaultExpanded={!i}
				/>
			))}
		</div>
	</>
);

export default AppointmentsForPatientStatic;
