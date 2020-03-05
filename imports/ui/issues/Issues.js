import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import ConsultationsMissingAPrice from './ConsultationsMissingAPrice.js' ;
import ConsultationsMissingABook from './ConsultationsMissingABook.js' ;
import PatientsMissingABirthdate from './PatientsMissingABirthdate.js' ;
import PatientsMissingAGender from './PatientsMissingAGender.js' ;

const styles = theme => ({
	container: {
		padding: theme.spacing(3),
	},
});

const Issues = ( { classes } ) => (
	<div>
		<Typography variant="h3">Consultations missing a price</Typography>
		<ConsultationsMissingAPrice className={classes.container}/>
		<Typography variant="h3">Consultations missing a book</Typography>
		<ConsultationsMissingABook className={classes.container}/>
		<Typography variant="h3">Patients missing a gender</Typography>
		<PatientsMissingAGender className={classes.container}/>
		<Typography variant="h3">Patients missing a birthdate</Typography>
		<PatientsMissingABirthdate className={classes.container}/>
	</div>
) ;

Issues.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Issues) ;
