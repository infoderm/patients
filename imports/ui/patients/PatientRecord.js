import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

import PatientPersonalInformation from './PatientPersonalInformation.js';

import ConsultationCard from '../consultations/ConsultationCard.js';
import AppointmentCard from '../appointments/AppointmentCard.js';
import DocumentCard from '../documents/DocumentCard.js';

import AttachFileButton from '../attachments/AttachFileButton.js';
import AttachmentLink from '../attachments/AttachmentLink.js';
import AttachmentsGallery from '../attachments/AttachmentsGallery.js';

import Loading from '../navigation/Loading.js';

import { Patients } from '../../api/patients.js';
import { Consultations } from '../../api/consultations.js';
import { Appointments } from '../../api/appointments.js';
import { Documents } from '../../api/documents.js';

const styles = theme => ({
	container: {
		padding: theme.spacing.unit * 3,
	},
	button: {
		margin: theme.spacing.unit,
	},
	leftIcon: {
		marginRight: theme.spacing.unit,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	},
});

class PatientRecord extends React.Component {

	constructor ( props ) {
		super(props);
	}

	render ( ) {

		const {
			classes,
			theme,
			loading,
			patient,
			consultations,
			upcomingAppointments,
			documents,
		} = this.props ;

		if (loading) return ( <Loading/> ) ;

		if (!patient) return <div>Error: Patient not found.</div>;

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

		//{ upcomingAppointments.length === 0 ?
			//<Typography variant="h2">No upcoming appointments</Typography>
			//:
			//<Typography variant="h2">Upcoming appointments</Typography>
		//}
		//<div className={classes.container}>
			//{ upcomingAppointments.map(appointment => ( <AppointmentCard key={appointment._id} appointment={appointment}/> )) }
		//</div>

		return (
			<div>
				<PatientPersonalInformation patient={patient}/>
				{ consultations.length === 0 ?
					<Typography variant="h2">No consultations</Typography>
					:
					<Typography variant="h2">All consultations</Typography>
				}
				<div className={classes.container}>
					{ consultations.map((consultation, i) => (
						<ConsultationCard
							key={consultation._id}
							consultation={consultation}
							patientChip={false}
							defaultExpanded={!i}
						/>
						))
					}
					<Button className={classes.button} color="default" component={Link} to={`/new/consultation/for/${patient._id}`}>
						Create a new consultation
						<SupervisorAccountIcon className={classes.rightIcon}/>
					</Button>
				</div>
				{ documents.length === 0 ?
					<Typography variant="h2">No documents</Typography>
					:
					<Typography variant="h2">All documents</Typography>
				}
				<div className={classes.container}>
					{ documents.map(document => ( <DocumentCard key={document._id} document={document}/> )) }
				</div>
				{ attachmentsInfo.length === 0 ?
					<Typography variant="h2">No attachments</Typography>
					:
					<Typography variant="h2">All attachments</Typography>
				}
				<div className={classes.container}>
					<AttachmentsGallery attachmentsInfo={attachmentsInfo}/>
					<AttachFileButton className={classes.button} color="default" method="patients.attach" item={patient._id}/>
				</div>
				{ false && ( <div>
				<Typography variant="h2">Prescriptions</Typography>
				<div className={classes.container}>
				</div>
				<Typography variant="h2">Appointments</Typography>
				<div className={classes.container}>
				</div>
				</div>)}
			</div>
		);
	}

}

PatientRecord.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withTracker(({match}) => {
	const _id = match.params.id;
	const handle = Meteor.subscribe('patient', _id);
	Meteor.subscribe('patient.consultations', _id);
	Meteor.subscribe('patient.appointments', _id);
	Meteor.subscribe('patient.documents', _id);
	if ( handle.ready() ) {
		const patient = Patients.findOne(_id);
		const consultations = Consultations.find({patientId: _id, isDone: true}, {sort: { datetime: -1 }}).fetch();
		const upcomingAppointments = Appointments.find({patientId: _id, isDone: false}, {sort: { datetime: 1 }}).fetch();
		const documents = Documents.find({patientId: _id}, {sort: { datetime: -1 }}).fetch();
		return {
			loading: false,
			patient,
			consultations,
			upcomingAppointments,
			documents,
		} ;
	}
	else return {
		loading: true,
		consultations: [],
		upcomingAppointments: [],
		documents: [],
	} ;
}) ( withStyles(styles, { withTheme: true })(PatientRecord) );
