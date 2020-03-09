import React, {Fragment} from 'react' ;
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import AppointmentCard from '../appointments/AppointmentCard.js';

export default function AppointmentsForPatientStatic ( { patient , appointments , ...rest } ) {

	return (
		<Fragment>
			{ appointments.length === 0 ?
				<Typography variant="h2">No upcoming appointments</Typography>
				:
				<Typography variant="h2">Upcoming appointments</Typography>
			}
			<div {...rest}>
				{ appointments.map((appointment, i) => (
					<AppointmentCard
						key={appointment._id}
						appointment={appointment}
						patientChip={false}
						defaultExpanded={!i}
					/>
					))
				}
			</div>
		</Fragment>
	) ;
}

AppointmentsForPatientStatic.propTypes = {
	patient: PropTypes.object.isRequired,
	appointments: PropTypes.array.isRequired,
};
