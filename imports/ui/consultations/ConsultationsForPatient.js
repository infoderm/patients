import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;

import { Consultations } from '../../api/consultations.js';

import Loading from '../navigation/Loading.js';

import ConsultationsForPatientStatic from './ConsultationsForPatientStatic.js';

function ConsultationsForPatient ( props ) {

	const {
		loading,
		...rest
	} = props ;

	if (loading) return <Loading/>;

	return <ConsultationsForPatientStatic {...rest}/>

}


export default withTracker(({patientId, page, perpage}) => {

	const handle = Meteor.subscribe('patient.consultations', patientId);

	const loading = !handle.ready();

	const consultations = loading ? [ ] : Consultations.find({
		patientId,
		isDone: true,
	}, {
      sort: { datetime: -1 },
      skip: (page-1)*perpage,
      limit: perpage,
    }).fetch() ;

	return {
		patientId,
		page,
		perpage,
		loading,
		consultations,
	} ;

}) ( ConsultationsForPatient );
