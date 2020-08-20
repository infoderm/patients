import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';

import {Patients} from '../../api/patients.js';
import {Documents} from '../../api/documents.js';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';

import DocumentsForPatientStatic from './DocumentsForPatientStatic.js';

const DocumentsForPatient = (props) => {
	const {loading, patient, ...rest} = props;

	if (loading) {
		return <Loading />;
	}

	if (!patient) {
		return <NoContent>Error: Patient not found.</NoContent>;
	}

	return <DocumentsForPatientStatic {...rest} />;
};

export default withTracker(({patientId, page, perpage}) => {
	const patientHandle = Meteor.subscribe('patient', patientId);
	const documentsHandle = Meteor.subscribe('patient.documents', patientId);

	const loading = !patientHandle.ready() || !documentsHandle.ready();

	const patient = loading ? null : Patients.findOne(patientId);

	const documents = loading
		? []
		: Documents.find(
				{
					patientId,
					deleted: false,
					lastVersion: true
				},
				{
					sort: {datetime: -1},
					skip: (page - 1) * perpage,
					limit: perpage
				}
		  ).fetch();

	return {
		patientId,
		page,
		perpage,
		loading,
		patient,
		documents
	};
})(DocumentsForPatient);
