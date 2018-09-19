import React from 'react' ;
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import { Link } from 'react-router-dom'

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

const styles = theme => ({
	chip: {
		marginRight: theme.spacing.unit,
		backgroundColor: '#aaa',
		color: '#fff',
	},
});

function PatientChip ( { classes , patient } ) {
	return (
		<Chip
		key={patient._id}
		avatar={patient.photo? <Avatar src={`data:image/png;base64,${patient.photo}`}/> : null}
		label={`${patient.lastname} ${patient.firstname}`}
		className={classes.chip}
		component={Link}
		to={`/patient/${patient._id}`}
		/>
	) ;
}

PatientChip.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	patient: PropTypes.object.isRequired,
} ;

export default withStyles(styles, { withTheme: true })(PatientChip);
