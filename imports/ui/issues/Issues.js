import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import ConsultationsMissingAPrice from './ConsultationsMissingAPrice.js' ;
import ConsultationsMissingABook from './ConsultationsMissingABook.js' ;
import PatientsMissingABirthdate from './PatientsMissingABirthdate.js' ;
import PatientsMissingAGender from './PatientsMissingAGender.js' ;
import UnlinkedDocuments from './UnlinkedDocuments.js' ;
import UnparsedDocuments from './UnparsedDocuments.js' ;
import MangledDocuments from './MangledDocuments.js' ;

const useStyles = makeStyles(
	theme => ({
		container: {
			padding: theme.spacing(3),
		},
	})
);

export default function Issues ( ) {

	const classes = useStyles();

	return (
		<div>
			<Typography variant="h3">Documents that are not parsed</Typography>
			<UnparsedDocuments className={classes.container}/>
			<Typography variant="h3">Documents that are not properly decoded</Typography>
			<MangledDocuments className={classes.container}/>
			<Typography variant="h3">Documents that are not linked</Typography>
			<UnlinkedDocuments className={classes.container}/>
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

}

Issues.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
} ;
