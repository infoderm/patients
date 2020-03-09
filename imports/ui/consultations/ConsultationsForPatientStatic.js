import React, {Fragment} from 'react' ;
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

import ConsultationCard from '../consultations/ConsultationCard.js';

export default function ConsultationsForPatientStatic ( { classes , patientId , consultations , ...rest } ) {

	return (
		<Fragment>
			{ consultations.length === 0 ?
				<Typography variant="h2">No consultations</Typography>
				:
				<Typography variant="h2">Last consultations</Typography>
			}
			<div {...rest}>
				{ consultations.map((consultation, i) => (
					<ConsultationCard
						key={consultation._id}
						consultation={consultation}
						patientChip={false}
						defaultExpanded={!i}
					/>
					))
				}
				<Button className={classes.button} color="default" component={Link} to={`/new/consultation/for/${patientId}`}>
					Create a new consultation
					<SupervisorAccountIcon className={classes.rightIcon}/>
				</Button>
			</div>
		</Fragment>
	) ;
}

ConsultationsForPatientStatic.propTypes = {
	classes: PropTypes.object.isRequired,
	patientId: PropTypes.string.isRequired,
	consultations: PropTypes.array.isRequired,
};
