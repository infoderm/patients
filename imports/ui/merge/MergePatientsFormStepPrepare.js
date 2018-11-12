import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { map } from '@aureooms/js-itertools' ;
import { list } from '@aureooms/js-itertools' ;
import { chain } from '@aureooms/js-itertools' ;


import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';

import MergePatientsConfirmationDialog from './MergePatientsConfirmationDialog.js' ;

import PatientSheet from '../patients/PatientSheet.js';

import { Patients } from '../../api/patients.js';
import { Consultations } from '../../api/consultations.js';

const styles = theme => ({
	container: {
		padding: theme.spacing.unit * 3,
	},
	button: {
		margin: theme.spacing.unit,
	},
	leftIcon: {
		marginRight: theme.spacing.unit,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	},
});

class MergePatientsFormStepPrepare extends React.Component {

	state = {
		merging: false ,
	} ;

	render ( ) {

		const { classes, theme, toMerge, onPrevStep , onNextStep , patients , consultations , newPatient , newConsultations } = this.props ;

		const { merging } = this.state ;

		return (

			<Grid container className={classes.container}>
				<Grid item sm={12} md={12}>
					<Grid container spacing={24} className={classes.container}>
						{ patients.map(patient => (
						<div key={patient._id}>
							<Typography variant="h1">{patient._id}</Typography>
							<PatientSheet patient={patient} consultations={consultations[patient._id]}/>
						</div> )) }
					</Grid>
					<Grid container spacing={24} className={classes.container}>
						<Typography variant="h1">New patient information</Typography>
						<PatientSheet patient={newPatient} consultations={newConsultations}/>
					</Grid>
				</Grid>
				<Grid item sm={12} md={12}>
					{ onPrevStep && <Button className={classes.button} color="default" onClick={onPrevStep}>
						<SkipPreviousIcon className={classes.leftIcon}/>
						Prev
					</Button> }
					{ onNextStep && <Button
						variant="contained"
						className={classes.button}
						color="primary"
						onClick={e => this.setState({merging: true})}
					>
						Next
						<SkipNextIcon className={classes.rightIcon}/>
					</Button> }
				</Grid>
				<Grid item sm={12} md={12}>
					<MergePatientsConfirmationDialog
						open={merging}
						onClose={e => this.setState({ merging: false})}
						toCreate={newPatient}
						consultationsToAttach={newConsultations}
						toDelete={toMerge}
					/>
				</Grid>
			</Grid>

		) ;

	}

}

function mergePatients ( patients ) {

	const newPatient = {
		allergies: [],
		doctors: [],
		insurances: [],
		attachments: [],
		noshow: 0,
	} ;

	for ( const oldPatient of patients ) {

		const replaceOne = function ( key ) {
			if (oldPatient[key]) newPatient[key] = oldPatient[key] ;
		} ;
		// This data is from the ID card.
		// Currently assuming that merge only needs to happen when
		// someone forgot their ID card the first time.
		// When that is the case, list entry with ID card last in the UI.
		// This is not done automatically for the moment.
		replaceOne('niss');
		replaceOne('firstname');
		replaceOne('lastname');
		replaceOne('birthdate');
		replaceOne('sex');
		replaceOne('photo');
		replaceOne('municipality');
		replaceOne('streetandnumber');
		replaceOne('zip');

		const concatParagraphs = function ( x ) {
			if (oldPatient[x]) newPatient[x] = newPatient[x] ? oldPatient[x] + '\n\n' + newPatient[x] : oldPatient[x]
		} ;

		concatParagraphs('antecedents') ;
		concatParagraphs('ongoing') ;
		concatParagraphs('about') ;

		const concatWords = function ( x ) {
			if (oldPatient[x]) newPatient[x] = newPatient[x] ? oldPatient[x] + ', ' + newPatient[x] : oldPatient[x]
		} ;

		concatWords('phone') ;

		const mergeSets = function ( x ) {
			if (oldPatient[x]) newPatient[x] = oldPatient[x].concat(newPatient[x]) ;
		} ;

		mergeSets('allergies');
		mergeSets('doctors');
		mergeSets('insurances');
		mergeSets('attachments');

		if (oldPatient.noshow) newPatient.noshow += oldPatient.noshow ;

	}

	newPatient.allergies = list(new Set(newPatient.allergies));
	newPatient.doctors = list(new Set(newPatient.doctors));
	newPatient.insurances = list(new Set(newPatient.insurances));
	newPatient.attachments = list(new Set(newPatient.attachments));

	return newPatient ;

}

MergePatientsFormStepPrepare.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	toMerge: PropTypes.array.isRequired,
};

export default withTracker(({toMerge}) => {
	Meteor.subscribe('patients');
	Meteor.subscribe('consultations');
	const patients = [] ;
	const consultations = {} ;
	for ( const patientId of toMerge ) {
		const patient = Patients.findOne(patientId) ;
		const consultationsForPatient = Consultations.find({patientId}, {sort: { datetime: -1 }}).fetch();
		patients.push(patient);
		consultations[patientId] = consultationsForPatient ;
	}
	return {
		patients,
		consultations,
		newPatient : mergePatients(patients) ,
		newConsultations : list(chain(map(x => consultations[x] || [], toMerge))) ,
	} ;
}) ( withStyles(styles, { withTheme: true })(MergePatientsFormStepPrepare) );
