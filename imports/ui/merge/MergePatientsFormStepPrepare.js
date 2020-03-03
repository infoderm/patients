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

import { Patients , patients } from '../../api/patients.js';
import { Consultations } from '../../api/consultations.js';
import { Documents } from '../../api/documents.js';

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

		const {
			classes,
			theme,
			toMerge,
			onPrevStep ,
			onNextStep ,
			error ,
			oldPatients ,
			consultations ,
			documents,
			newPatient ,
			newConsultations ,
			newDocuments ,
		} = this.props ;

		const { merging } = this.state ;

		return (

			<Grid container className={classes.container}>
				{ !error && <Grid item sm={12} md={12}>
					<Grid container spacing={24} className={classes.container}>
						{ oldPatients.map(patient => (
						<div key={patient._id}>
							<Typography variant="h1">{patient._id}</Typography>
							<PatientSheet
								patient={patient}
								consultations={consultations[patient._id]}
								documents={documents[patient._id]}
							/>
						</div> )) }
					</Grid>
					<Grid container spacing={24} className={classes.container}>
						<Typography variant="h1">New patient information</Typography>
						<PatientSheet
							patient={newPatient}
							consultations={newConsultations}
							documents={newDocuments}
						/>
					</Grid>
				</Grid> }
				{ error && <Grid item sm={12} md={12}>
					<span>{error.message}</span>
				</Grid> }
				<Grid item sm={12} md={12}>
					{ onPrevStep && <Button className={classes.button} color="default" onClick={onPrevStep}>
						<SkipPreviousIcon className={classes.leftIcon}/>
						Prev
					</Button> }
					{ !error && onNextStep && <Button
						variant="contained"
						className={classes.button}
						color="primary"
						onClick={e => this.setState({merging: true})}
					>
						Next
						<SkipNextIcon className={classes.rightIcon}/>
					</Button> }
				</Grid>
				{ !error && <Grid item sm={12} md={12}>
					<MergePatientsConfirmationDialog
						open={merging}
						onClose={e => this.setState({ merging: false})}
						toCreate={newPatient}
						consultationsToAttach={list(map(x=>x._id,newConsultations))}
						documentsToAttach={list(map(x=>x._id,newDocuments))}
						toDelete={toMerge}
					/>
				</Grid> }
			</Grid>

		) ;

	}

}

MergePatientsFormStepPrepare.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	toMerge: PropTypes.array.isRequired,
};

export default withTracker(({toMerge}) => {
	for ( const patientId of toMerge ) {
		Meteor.subscribe('patient', patientId);
		Meteor.subscribe('patient.consultations', patientId);
		Meteor.subscribe('patient.appointments', patientId);
		Meteor.subscribe('patient.documents', patientId);
	}
	const oldPatients = [] ;
	const consultations = {} ;
	const documents = {} ;
	for ( const patientId of toMerge ) {
		const patient = Patients.findOne(patientId) ;
		if ( patient === undefined ) {
			const error = {
				message : `Cannot merge because patient #${patientId} does not exist in the database.`
			} ;
			return { error } ;
		}
		const consultationsForPatient = Consultations.find({patientId}, {sort: { datetime: -1 }}).fetch();
		const documentsForPatient = Documents.find({patientId}, {sort: { createdAt: -1 }}).fetch();
		oldPatients.push(patient);
		consultations[patientId] = consultationsForPatient ;
		documents[patientId] = documentsForPatient ;
	}
	return {
		oldPatients,
		consultations,
		documents,
		newPatient : patients.merge(oldPatients) ,
		newConsultations : list(chain(map(x => consultations[x] || [], toMerge))) ,
		newDocuments : list(chain(map(x => documents[x] || [], toMerge))) ,
	} ;
}) ( withStyles(styles, { withTheme: true })(MergePatientsFormStepPrepare) );
