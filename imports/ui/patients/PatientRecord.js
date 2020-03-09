import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import TabJumper from '../navigation/TabJumper.js';
import NoMatch from '../navigation/NoMatch.js';

import PatientHeader from './PatientHeader.js';
import PatientPersonalInformation from './PatientPersonalInformation.js';

import ConsultationsForPatient from '../consultations/ConsultationsForPatient.js';
import AppointmentsForPatient from '../appointments/AppointmentsForPatient.js';
import DocumentsForPatient from '../documents/DocumentsForPatient.js';
import AttachmentsForPatient from '../attachments/AttachmentsForPatient.js';

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
	} = props ;

	const tabs = ['information', 'appointments', 'consultations', 'documents', 'attachments'] ;

	return (
		<div className={classes.root}>
			<PatientHeader patientId={patientId}/>
			<TabJumper tabs={tabs} current={tab} toURL={tab => `/patient/${patientId}/${tab}`}/>
			{(tab === 'information' && <PatientPersonalInformation patientId={patientId}/>)}
			{(tab === 'appointments' && <AppointmentsForPatient className={classes.container} patientId={patientId} page={page} perpage={perpage}/>)}
			{(tab === 'consultations' && <ConsultationsForPatient className={classes.container} classes={classes} patientId={patientId} page={page} perpage={perpage}/>)}
			{(tab === 'documents' && <DocumentsForPatient className={classes.container} patientId={patientId} page={page} perpage={perpage}/>)}
			{(tab === 'attachments' && <AttachmentsForPatient className={classes.container} classes={classes} patientId={patientId} page={page} perpage={perpage}/>)}
			{tabs.indexOf(tab) === -1 && <NoMatch location={location}/>}
		</div>
	);
}

PatientRecord.defaultProps = {
	tab: 'information',
	page: 1,
	perpage: 2,
} ;

PatientRecord.propTypes = {
	patientId: PropTypes.string.isRequired,
	tab: PropTypes.string.isRequired,
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
} ;

export default withTracker(({match, location, patientId, tab, page, perpage}) => {
	patientId = patientId || match.params.id;
	tab = tab || match.params.tab || PatientRecord.defaultProps.tab;
	page = page || parseInt(match.params.page, 10) || PatientRecord.defaultProps.page;
	perpage = perpage || PatientRecord.defaultProps.perpage;

	return {
		location,
		patientId,
		tab,
		page,
		perpage,
	} ;
}) ( PatientRecord );
