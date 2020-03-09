import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;

import { Documents } from '../../api/documents.js';

import Loading from '../navigation/Loading.js';

import DocumentsForPatientStatic from './DocumentsForPatientStatic.js';

function DocumentsForPatient ( props ) {

	const {
		loading,
		...rest
	} = props ;

	if (loading) return <Loading/>;

	return <DocumentsForPatientStatic {...rest}/>

}


export default withTracker(({patientId, page, perpage}) => {

	const handle = Meteor.subscribe('patient.documents', patientId);

	const loading = !handle.ready();

	const documents = loading ? [ ] : Documents.find({
		patientId,
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
		documents,
	} ;

}) ( DocumentsForPatient );
