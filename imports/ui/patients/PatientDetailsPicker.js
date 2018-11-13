import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import Typography from '@material-ui/core/Typography';

import React from 'react' ;
import PropTypes from 'prop-types';

import PatientSheet from './PatientSheet.js';

import { Patients } from '../../api/patients.js';
import { Consultations } from '../../api/consultations.js';


class PatientDetailsPicker extends React.Component {

	render ( ) {

		const { classes, theme, patientId, loading, patient, consultations, onError, onLoad } = this.props ;

		if (loading) return <div>Loading...</div>;
		if (!patient) {
			if ( onError ) onError( patientId ) ;
			return <div>Error: Patient not found.</div>;
		}

		if (onLoad) onLoad(patient, consultations) ;

		return (
			<div>
				<Typography variant="h1">{patientId}</Typography>
				<PatientSheet patient={patient} consultations={consultations}/>
			</div>
		) ;

	}

}

export default withTracker(({patientId}) => {
	const handle = Meteor.subscribe('patient', patientId);
	Meteor.subscribe('patient.consultations', patientId);
	if ( handle.ready() ) {
		const patient = Patients.findOne(patientId);
		const consultations = Consultations.find({patientId}, {sort: { datetime: -1 }}).fetch();
		return { loading: false, patient, consultations } ;
	}
	else return { loading: true } ;
}) (PatientDetailsPicker);
