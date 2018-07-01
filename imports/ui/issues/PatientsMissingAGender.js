import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data' ;
import { Patients } from '../../api/patients.js';

import React from 'react';

import Grid from '@material-ui/core/Grid';

import PatientCard from '../PatientCard.js';

const PatientsMissingAGender = ( { loading, patients, ...rest }) => {

	if (loading) return <div {...rest}>Loading...</div>;

	if (patients.length === 0) return <div {...rest}>All patients have a gender :)</div>;

	return (
		<Grid container spacing={24} {...rest}>
			{ patients.map(patient => ( <PatientCard key={patient._id} patient={patient}/> )) }
		</Grid>
	);

}

export default withTracker(() => {
	const handle = Meteor.subscribe('patients');
	if ( !handle.ready()) return { loading: true } ;
	return {
		loading: false,
		patients: Patients.find({
			$or: [
				{ sex : null } ,
				{ sex : '' } ,
			] ,
		}).fetch(),
	} ;
}) (PatientsMissingAGender) ;
