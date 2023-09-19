import React from 'react';

import NoContent from '../navigation/NoContent';

import ReactiveConsultationCard from '../consultations/ReactiveConsultationCard';

type Props = {
	readonly patientId: string;
	readonly appointments: Array<{_id: string}>;
	readonly page: number;
};

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
