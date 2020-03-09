import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import TabJumper from '../navigation/TabJumper.js';
import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';
import NoMatch from '../navigation/NoMatch.js';

import PatientHeader from './PatientHeader.js';
import PatientPersonalInformation from './PatientPersonalInformation.js';

import ConsultationsForPatient from '../consultations/ConsultationsForPatient.js';
import AppointmentsForPatient from '../appointments/AppointmentsForPatientStatic.js';
import DocumentsForPatient from '../documents/DocumentsForPatientStatic.js';
import AttachmentsForPatient from '../attachments/AttachmentsForPatientStatic.js';

import { Patients } from '../../api/patients.js';
import { Consultations } from '../../api/consultations.js';
import { Appointments } from '../../api/appointments.js';
import { Documents } from '../../api/documents.js';

const useStyles = makeStyles(
	theme => ({
		root: {
			paddingTop: 80,
		},
		container: {
			padding: theme.spacing(3),
		},
		button: {
			margin: theme.spacing(1),
		},
		leftIcon: {
			marginRight: theme.spacing(1),
		},
		rightIcon: {
			marginLeft: theme.spacing(1),
		},
	})
);

function PatientRecord ( props ) {

	const classes = useStyles();

	const {
		location,
		patientId,
		tab,
		page,
		perpage,
		loading,
		limit,
		patient,
		consultations,
		upcomingAppointments,
		documents,
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

	const tabs = ['information', 'appointments', 'consultations', 'documents', 'attachments'] ;

	return (
		<div className={classes.root}>
			<PatientHeader patientId={patientId}/>
			<TabJumper tabs={tabs} current={tab} toURL={tab => `/patient/${patientId}/${tab}`}/>
			{(tab === 'information' && <PatientPersonalInformation patientId={patientId}/>)}
			{(tab === 'appointments' && <AppointmentsForPatient className={classes.container} patient={patient} appointments={upcomingAppointments} page={page} perpage={perpage}/>)}
			{(tab === 'consultations' && <ConsultationsForPatient className={classes.container} classes={classes} patientId={patientId} page={page} perpage={perpage}/>)}
			{(tab === 'documents' && <DocumentsForPatient className={classes.container} patient={patient} documents={documents} page={page} perpage={perpage}/>)}
			{(tab === 'attachments' && <AttachmentsForPatient className={classes.container} classes={classes} patient={patient} attachmentsInfo={attachmentsInfo} page={page} perpage={perpage}/>)}
			{tabs.indexOf(tab) === -1 && <NoMatch location={location}/>}
		</div>
	);
}

PatientRecord.defaultProps = {
	tab: 'information',
	page: 1,
	perpage: 10,
} ;

PatientRecord.propTypes = {
	patientId: PropTypes.string.isRequired,
	tab: PropTypes.string.isRequired,
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
} ;

export default withTracker(({match, location, patientId, tab, page, perpage}) => {

	const limit = 5;
	const order = (chronology, limit) => ({ sort: { datetime: chronology } , limit });
	const lastFew = order(-1, 5);
	const firstFew = order(1, 5);

	const _id = patientId || match.params.id;
	tab = tab || match.params.tab || PatientRecord.defaultProps.tab;
	page = page || match.params.page || PatientRecord.defaultProps.page;
	perpage = perpage || match.params.perpage || PatientRecord.defaultProps.perpage;

	const handle = Meteor.subscribe('patient', _id);
	Meteor.subscribe('patient.consultations', _id, lastFew);
	Meteor.subscribe('patient.appointments', _id, firstFew);
	Meteor.subscribe('patient.documents', _id, lastFew);
	if ( handle.ready() ) {

		const patient = Patients.findOne(_id);

		const consultations = Consultations.find({
			patientId: _id,
			isDone: true,
		}, lastFew).fetch();

		const upcomingAppointments = Appointments.find({
			patientId: _id,
			isDone: false,
		}, firstFew).fetch();

		const documents = Documents.find({
			patientId: _id,
		}, lastFew).fetch();

		return {
			location,
			patientId: _id,
			tab,
			page,
			perpage,
			loading: false,
			limit,
			patient,
			consultations,
			upcomingAppointments,
			documents,
		} ;

	}
	else return {
		location,
		patientId: _id,
		tab,
		page,
		perpage,
		loading: true,
		limit,
		consultations: [],
		upcomingAppointments: [],
		documents: [],
	} ;
}) ( PatientRecord );
