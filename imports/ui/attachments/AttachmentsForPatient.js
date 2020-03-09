import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;

import { Patients } from '../../api/patients.js';
import { Consultations } from '../../api/consultations.js';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';

import AttachmentsForPatientStatic from '../attachments/AttachmentsForPatientStatic.js';

function PatientRecord ( props ) {

	const {
		patientId,
		loading,
		patient,
		consultations,
		...rest
	} = props ;

	if (loading) return ( <Loading/> ) ;

	if (!patient) return <NoContent>Error: Patient not found.</NoContent>;

	const attachmentsInfo = [];
	if ( patient.attachments ) {
		Array.prototype.push.apply(
			attachmentsInfo,
			patient.attachments.map(x => [
				x ,
				{
					collection: 'patients' ,
					_id: patient._id ,
				} ,
			]),
		);
	}
	attachmentsInfo.reverse();

	for ( const consultation of consultations ) {
		if ( consultation.attachments ) {
			Array.prototype.push.apply(
				attachmentsInfo,
				consultation.attachments.map(x => [
					x ,
					{
						collection: 'consultations' ,
						_id: consultation._id ,
					} ,
				]),
			);
		}
	}

	return (
		<AttachmentsForPatientStatic patientId={patientId} attachmentsInfo={attachmentsInfo} {...rest}/>
	);
}

export default withTracker(({patientId, page, perpage}) => {

	const patientHandle = Meteor.subscribe('patient', patientId);
	const consultationsHandle = Meteor.subscribe('patient.consultations', patientId);

	const loading = !patientHandle.ready() || !consultationsHandle.ready();

	const patient = loading ? null : Patients.findOne(patientId);

	const consultations = loading ? [] : Consultations.find({
			patientId,
			isDone: true,
		}).fetch();

	return {
		patientId,
		page,
		perpage,
		loading,
		patient,
		consultations,
	} ;
}) ( PatientRecord );
