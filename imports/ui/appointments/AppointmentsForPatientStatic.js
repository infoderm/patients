import React from 'react';
import PropTypes from 'prop-types';

import NoContent from '../navigation/NoContent.js';

import AppointmentCard from '../appointments/AppointmentCard.js';

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
					<AppointmentCard
						key={appointment._id}
						appointment={appointment}
						patientChip={false}
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
