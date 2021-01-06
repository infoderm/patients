import React from 'react';
import PropTypes from 'prop-types';

import NoContent from '../navigation/NoContent.js';

import StaticConsultationCard from '../consultations/StaticConsultationCard.js';

export default function AppointmentsForPatientStatic({
	patientId,
	appointments,
	page,
	...rest
}) {
	return (
		<>
			{appointments.length === 0 && (
				<NoContent>Nothing to see on page {page}.</NoContent>
			)}
			<div {...rest}>
				{appointments.map((appointment, i) => (
					<StaticConsultationCard
						key={appointment._id}
						consultation={appointment}
						defaultExpanded={!i}
					/>
				))}
			</div>
		</>
	);
}

AppointmentsForPatientStatic.propTypes = {
	appointments: PropTypes.array.isRequired,
	page: PropTypes.number.isRequired
};
