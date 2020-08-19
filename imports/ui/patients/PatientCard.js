import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;

import StaticPatientCard from './StaticPatientCard.js' ;

import { Patients } from '../../api/patients.js';

function PatientCard ( { patient } ) {
	return <StaticPatientCard patient={patient}/> ;
}

export default withTracker(({ patient }) => {

	const patientId = patient._id ;
	const options = { fields: StaticPatientCard.projection } ;
	const handle = Meteor.subscribe('patient', patientId, options);

	if ( handle.ready() ) {
		return { loading: false, patient: Patients.findOne(patientId, options) } ;
	}
	else return { loading: true, patient } ;

}) ( PatientCard ) ;
