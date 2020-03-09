import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;

import { Patients } from '../../api/patients.js';
import { Consultations } from '../../api/consultations.js';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';

import ConsultationsPager from './ConsultationsPager.js';

function ConsultationsForPatient ( props ) {

	const {
		patientId,
		loading,
		patient,
		page,
		perpage,
		...rest
	} = props ;

	if (loading) return <Loading/>;

	if (!patient) return <NoContent>Error: Patient not found.</NoContent>;

	const query = {
	    patientId,
	    isDone: true,
	} ;

	const sort = {datetime: -1} ;

	return <ConsultationsPager
		root={`/patient/${patientId}/consultations`}
		page={page}
		perpage={perpage}
		query={query}
		sort={sort}
		itemProps={{patientChip: false}}
	/> ;

}


export default withTracker(({patientId}) => {

	const patientHandle = Meteor.subscribe('patient', patientId);

	const loading = !patientHandle.ready() ;

	const patient = loading ? null : Patients.findOne(patientId);

	return {
		loading,
		patient,
	} ;

}) ( ConsultationsForPatient );
