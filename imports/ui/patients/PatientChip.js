import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;

import StaticPatientChip from './StaticPatientChip.js';

import { Patients } from '../../api/patients.js';

function PatientChip ( props ) {
	return <StaticPatientChip {...props}/> ;
}

PatientChip.projection = {
	_id: 1,
} ;

export default withTracker(({ patient }) => {

	const patientId = patient._id ;
	const options = { fields: StaticPatientChip.projection } ;
	const handle = Meteor.subscribe('patient', patientId, options);

	if ( handle.ready() ) {
		const _patient = Patients.findOne(patientId, options);
		const exists = !!_patient;
		return { loading: false, exists, patient: _patient } ;
	}
	else return { loading: true, patient } ;

}) ( PatientChip ) ;
