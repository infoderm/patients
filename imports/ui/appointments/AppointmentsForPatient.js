import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;

import { Consultations } from '../../api/consultations.js';

import Loading from '../navigation/Loading.js';

import AppointmentsForPatientStatic from './AppointmentsForPatientStatic.js';

function AppointmentsForPatient ( props ) {

	const {
		loading,
		...rest
	} = props ;

	if (loading) return <Loading/>;

	return <AppointmentsForPatientStatic {...rest}/>

}


export default withTracker(({patientId, page, perpage}) => {

	const handle = Meteor.subscribe('patient.appointments', patientId);

	const loading = !handle.ready();

	const appointments = loading ? [ ] : Consultations.find({
		patientId,
		isDone: false,
	}, {
		sort: { datetime: 1 },
		skip: (page-1)*perpage,
		limit: perpage,
	}).fetch() ;

	return {
		patientId,
		page,
		perpage,
		loading,
		appointments,
	} ;

}) ( AppointmentsForPatient );
