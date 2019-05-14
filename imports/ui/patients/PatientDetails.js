import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Link } from 'react-router-dom';
import { Prompt } from 'react-router';

import { map } from '@aureooms/js-itertools' ;
import { list } from '@aureooms/js-itertools' ;
import { filter } from '@aureooms/js-itertools' ;
import { take } from '@aureooms/js-itertools' ;

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import UndoIcon from '@material-ui/icons/Undo';

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import format from 'date-fns/format';
import distanceInWordsStrict from 'date-fns/distance_in_words_strict';
import startOfToday from 'date-fns/start_of_today';

import odiff from 'odiff' ;
import { empty } from '@aureooms/js-cardinality' ;

import PatientDeletionDialog from './PatientDeletionDialog.js';

import ConsultationCard from '../consultations/ConsultationCard.js';
import AppointmentCard from '../appointments/AppointmentCard.js';
import DocumentCard from '../documents/DocumentCard.js';

import AttachFileButton from '../attachments/AttachFileButton.js';
import AttachmentLink from '../attachments/AttachmentLink.js';
import AttachmentsGallery from '../attachments/AttachmentsGallery.js';

import SetPicker from '../input/SetPicker.js';

import AllergyChip from '../allergies/AllergyChip.js';

import { Patients } from '../../api/patients.js';
import { Consultations } from '../../api/consultations.js';
import { Appointments } from '../../api/appointments.js';
import { Documents } from '../../api/documents.js';
import { Insurances } from '../../api/insurances.js';
import { Doctors } from '../../api/doctors.js';
import { Allergies } from '../../api/allergies.js';

const styles = theme => ({
	header: {
		backgroundColor: 'white',
		position: 'fixed',
		top: '76px',
		paddingTop: '0.4em',
		zIndex: 10,
		marginLeft: '-24px',
		marginRight: '-24px',
		boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2),0px 4px 5px 0px rgba(0, 0, 0, 0.14),0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
	},
	avatar: {
		width: '48px',
		height: '48px',
	},
	photoPlaceHolder: {
		display: 'flex',
		fontSize: '4rem',
		margin: 0,
		width: 140,
		height: 200,
		alignItems: 'center',
		justifyContent: 'center',
		color: '#fff',
		backgroundColor: '#999',
		verticalAlign: 'top',
		marginRight: theme.spacing.unit * 2,
	},
	photo: {
		width: 140,
		height: 200,
		verticalAlign: 'top',
		marginRight: theme.spacing.unit * 2,
	},
	formControl: {
		margin: theme.spacing.unit,
		overflow: 'auto',
		'& input, & div' : {
			color: 'black !important',
		} ,
	},
	container: {
		padding: theme.spacing.unit * 3,
	},
	details: {
		paddingTop: 80,
	},
	multiline: {
		margin: theme.spacing.unit,
		overflow: 'auto',
		width: `calc(100% - ${theme.spacing.unit*2}px)`,
		'& textarea' : {
			color: 'black !important',
		} ,
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
	problem:{
		color: 'red',
	},
});

const tagFilter = set => (suggestions, inputValue) => {

	const notInSet = x => !set ? true : set.indexOf(x.name)===-1 ;
	const matches = x => !inputValue || x.name.toLowerCase().includes(inputValue.toLowerCase()) ;

	const keep = 5 ;

	return list( take( filter(notInSet, filter(matches, suggestions) ) , keep ) ) ;

} ;

class PatientDetails extends React.Component {

	constructor ( props ) {
		super(props);
		this.state = {
			patient: props.patient,
			editing: false,
			dirty: false,
			deleting: false,
		};
	}

	componentWillReceiveProps ( nextProps ) {
		if ( ! empty(odiff(this.props.patient, nextProps.patient))) {
			this.setState({
				patient: nextProps.patient,
				editing: false,
				dirty: false,
				deleting: false,
			});
		}
	}

	saveDetails = event => {
		Meteor.call('patients.update', this.props.patient._id, this.state.patient , ( err , res ) => {
			if ( err ) console.error(err);
			else {
				this.setState({ editing: false, dirty: false });
			}
		} ) ;
	} ;

	render ( ) {

		const {
			classes,
			theme,
			loading,
			consultations,
			upcomingAppointments,
			documents,
			insurances,
			doctors,
			allergies,
		} = this.props ;

		const { patient , editing , dirty , deleting } = this.state;

		if (loading) return <div>Loading...</div>;
		if (!patient) return <div>Error: Patient not found.</div>;

		const placeholder = !editing ? "To edit this field you first need to click the edit button" : "Write some information here";

		const attachmentsInfo = [];
		if ( this.props.patient.attachments ) {
			Array.prototype.push.apply(
				attachmentsInfo,
				this.props.patient.attachments.map(x => [
					x ,
					{
						collection: 'patients' ,
						_id: this.props.patient._id ,
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

		const minRows = 8 ;
		const maxRows = 100 ;

		const update = (key, f = v => v) => e => {
			this.setState({
				patient : {
					...patient ,
					[key]: f(e.target.value),
				},
				dirty: true,
			});
		} ;

		const updateList = key => update(key, v => list(map(x=>x.name, v))) ;

		return (
			<div>
				<Prompt
					when={dirty}
					message="You are trying to leave the page while in edit mode. Are you sure you want to continue?"
				/>
				<Grid className={classes.header} container spacing={24}>
					{(!patient.photo) ? '' :
					<Grid item xs={1}>
					<Avatar
						alt={`${patient.firstname} ${patient.lastname}`}
						src={`data:image/png;base64,${patient.photo}`}
						className={classes.avatar}
						/>
					</Grid>
					}
					<Grid item xs={2}>
						<TextField inputProps={{readOnly: true}} label="Lastname" value={patient.lastname}/>
					</Grid>
					<Grid item xs={2}>
						<TextField inputProps={{readOnly: true}} label="Firstname" value={patient.firstname}/>
					</Grid>
					<Grid item xs={2}>
						<TextField inputProps={{readOnly: true}} label="NISS" value={patient.niss}/>
					</Grid>
					<Grid item xs={2}>
						<TextField inputProps={{readOnly: true}} label="Patient id" value={patient._id}/>
					</Grid>
				</Grid>
				<Grid container className={classNames(classes.container, classes.details)}>
					<Grid item sm={4} md={2}>
						{ patient.photo ?
						<img
							className={classes.photo}
							src={`data:image/png;base64,${patient.photo}`}
							title={`${patient.firstname} ${patient.lastname}`}
						/> :
						<div className={classes.photoPlaceHolder}>
							{patient.firstname ? patient.firstname[0] : '?'}{patient.lastname ? patient.lastname[0] : '?'}
						</div>
						}
						{ !patient.birthdate ? '' :
						<Typography variant="h5">{format(patient.birthdate,'D MMM YYYY')}</Typography> }
						{ !patient.birthdate ? '' :
						<Typography variant="h5">{distanceInWordsStrict(patient.birthdate,startOfToday())}</Typography> }
						{ !patient.noshow ? '' :
						<Typography className={classes.problem} variant="h4">PVPP = {patient.noshow}</Typography> }
					</Grid>
					<Grid item sm={8} md={10}>
						<form>
						<Grid container>
							<Grid item xs={2}>
								<TextField className={classes.formControl}
									label="NISS"
									value={patient.niss}
									onChange={update('niss')}
									inputProps={{
										readOnly: !editing,
									}}
									margin="normal"
								/>
							</Grid>
							<Grid item xs={3}>
								<TextField className={classes.formControl}
									label="Last name"
									value={patient.lastname}
									onChange={update('lastname')}
									inputProps={{
										readOnly: !editing,
									}}
									margin="normal"
								/>
							</Grid>
							<Grid item xs={3}>
								<TextField className={classes.formControl}
									label="First name"
									value={patient.firstname}
									onChange={update('firstname')}
									inputProps={{
										readOnly: !editing,
									}}
									margin="normal"
								/>
							</Grid>
							<Grid item xs={2}>
							<FormControl className={classes.formControl}>
								<InputLabel htmlFor="sex">Sex</InputLabel>
								<Select
									value={patient.sex || ''}
									onChange={update('sex')}
									inputProps={{
										readOnly: !editing,
										name: 'sex',
										id: 'sex',
									}}
								>
									<MenuItem value=""><em>None</em></MenuItem>
									<MenuItem value="female">Female</MenuItem>
									<MenuItem value="male">Male</MenuItem>
									<MenuItem value="other">Other</MenuItem>
								</Select>
							</FormControl>
							</Grid>
							<Grid item xs={2}>
							<TextField className={classes.formControl} type="date"
								disabled={!editing}
								label="Birth date"
								InputLabelProps={{
								  shrink: true,
								}}
								value={patient.birthdate}
								onChange={update('birthdate')}
								margin="normal"
							/>
							</Grid>
							<Grid item xs={12} md={6}>
							<TextField
								inputProps={{
									readOnly: !editing,
								}}
								label="Antécédents"
								placeholder={placeholder}
								multiline
								rows={minRows}
								rowsMax={maxRows}
								className={classes.multiline}
								value={patient.antecedents}
								onChange={update('antecedents')}
								margin="normal"
							/>
							</Grid>
							<Grid item xs={12} md={6}>
							<TextField
								inputProps={{
									readOnly: !editing,
								}}
								label="Traitement en cours"
								placeholder={placeholder}
								multiline
								rows={minRows}
								rowsMax={maxRows}
								className={classes.multiline}
								value={patient.ongoing}
								onChange={update('ongoing')}
								margin="normal"
							/>
							</Grid>

							<Grid item xs={12} md={12}>
								<SetPicker
									suggestions={allergies}
									itemToKey={x=>x._id}
									itemToString={x=>x.name}
									createNewItem={name=>({name})}
									filter={tagFilter(patient.allergies)}
									readOnly={!editing}
									TextFieldProps={{
										label: "Allergies",
										margin: "normal",
									}}
									chip={AllergyChip}
									chipProps={{
										avatar: <Avatar>Al</Avatar>,
									}}
									value={list(map(x=>({name: x}), patient.allergies || []))}
									onChange={updateList('allergies')}
									placeholder={placeholder}
								/>
							</Grid>

							<Grid item xs={12} md={6}>
							<TextField
								inputProps={{
									readOnly: !editing,
								}}
								label="Rue et Numéro"
								placeholder={placeholder}
								multiline
								rows={1}
								className={classes.multiline}
								value={patient.streetandnumber}
								onChange={update('streetandnumber')}
								margin="normal"
							/>
							</Grid>
							<Grid item xs={12} md={2}>
							<TextField
								inputProps={{
									readOnly: !editing,
								}}
								label="Code Postal"
								placeholder={placeholder}
								multiline
								rows={1}
								className={classes.multiline}
								value={patient.zip}
								onChange={update('zip')}
								margin="normal"
							/>
							</Grid>
							<Grid item xs={12} md={4}>
							<TextField
								inputProps={{
									readOnly: !editing,
								}}
								label="Commune"
								placeholder={placeholder}
								multiline
								rows={1}
								className={classes.multiline}
								value={patient.municipality}
								onChange={update('municipality')}
								margin="normal"
							/>
							</Grid>

							<Grid item xs={12} md={4}>
							<TextField
								inputProps={{
									readOnly: !editing,
								}}
								label="Numéro de téléphone"
								placeholder={placeholder}
								multiline
								rows={1}
								className={classes.multiline}
								value={patient.phone}
								onChange={update('phone')}
								margin="normal"
							/>
							</Grid>
							<Grid item xs={12} md={4}>
								<SetPicker
									suggestions={doctors}
									itemToKey={x=>x._id}
									itemToString={x=>x.name}
									createNewItem={name=>({name})}
									filter={tagFilter(patient.doctors)}
									readOnly={!editing}
									TextFieldProps={{
										label: "Médecin Traitant",
										margin: "normal",
									}}
									chipProps={{
										avatar: <Avatar>Dr</Avatar>,
									}}
									value={list(map(x=>({name: x}), patient.doctors || []))}
									onChange={updateList('doctors')}
									placeholder={placeholder}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<SetPicker
									suggestions={insurances}
									itemToKey={x=>x._id}
									itemToString={x=>x.name}
									createNewItem={name=>({name})}
									filter={tagFilter(patient.insurances)}
									readOnly={!editing}
									TextFieldProps={{
										label: "Mutuelle",
										margin: "normal",
									}}
									chipProps={{
										avatar: <Avatar>In</Avatar>,
									}}
									value={list(map(x=>({name: x}), patient.insurances || []))}
									onChange={updateList('insurances')}
									placeholder={placeholder}
								/>
							</Grid>

							<Grid item xs={9}>
							<TextField
								inputProps={{
									readOnly: !editing,
								}}
								label="About"
								placeholder={placeholder}
								multiline
								rows={2}
								rowsMax={maxRows}
								className={classes.multiline}
								value={patient.about}
								onChange={update('about')}
								margin="normal"
							/>
							</Grid>
							<Grid item xs={3}>
							<TextField
								inputProps={{
									readOnly: !editing,
								}}
								label="PVPP"
								placeholder={placeholder}
								className={classes.multiline}
								value={patient.noshow || 0}
								onChange={update('noshow', v => v === '' ? 0 : parseInt(v,10))}
								margin="normal"
							/>
							</Grid>
						</Grid>
						</form>
					</Grid>
					<Grid container>
						<Grid item xs={6}>
							{ editing ?
							<div>
								<Button className={classes.button} color="primary" onClick={this.saveDetails}>
									Save patient details
									<SaveIcon className={classes.rightIcon}/>
								</Button>
								<Button className={classes.button} color="secondary" onClick={e => this.setState({ editing: false, dirty: false, patient: this.props.patient })}>
									Undo changes
									<UndoIcon className={classes.rightIcon}/>
								</Button>
							</div>:
							<Button className={classes.button} color="default" onClick={e => this.setState({ editing: true })}>
								Edit patient details
								<EditIcon className={classes.rightIcon}/>
							</Button> }
						</Grid>
						<Grid item xs={6} style={{display: 'flex', flexDirection: 'row-reverse'}}>
							<Button className={classes.button} color="secondary" onClick={e => this.setState({ deleting: true})}>
								Delete this patient
								<DeleteIcon className={classes.rightIcon}/>
							</Button>
							<PatientDeletionDialog open={deleting} onClose={e => this.setState({ deleting: false})} patient={this.props.patient}/>
						</Grid>
					</Grid>
				</Grid>
				{ upcomingAppointments.length === 0 ?
					<Typography variant="h2">No upcoming appointments</Typography>
					:
					<Typography variant="h2">Upcoming appointments</Typography>
				}
				<div className={classes.container}>
					{ upcomingAppointments.map(appointment => ( <AppointmentCard key={appointment._id} appointment={appointment}/> )) }
				</div>
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
					<Button className={classes.button} color="default" component={Link} to={`/new/consultation/for/${this.props.patient._id}`}>
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

PatientDetails.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withTracker(({match}) => {
	const _id = match.params.id;
	const handle = Meteor.subscribe('patient', _id);
	Meteor.subscribe('patient.consultations', _id);
	Meteor.subscribe('patient.appointments', _id);
	Meteor.subscribe('patient.documents', _id);
	Meteor.subscribe('insurances');
	Meteor.subscribe('doctors');
	Meteor.subscribe('allergies');
	if ( handle.ready() ) {
		const patient = Patients.findOne(_id);
		const consultations = Consultations.find({patientId: _id, isDone: true}, {sort: { datetime: -1 }}).fetch();
		const upcomingAppointments = Appointments.find({patientId: _id, isDone: false}, {sort: { datetime: 1 }}).fetch();
		const documents = Documents.find({patientId: _id}, {sort: { datetime: -1 }}).fetch();
		const insurances = Insurances.find({}, {sort: { name: 1 }}).fetch();
		const doctors = Doctors.find({}, {sort: { name: 1 }}).fetch();
		const allergies = Allergies.find({}, {sort: { name: 1 }}).fetch();
		return {
			loading: false,
			patient,
			consultations,
			upcomingAppointments,
			documents,
			insurances,
			doctors,
			allergies,
		} ;
	}
	else return {
		loading: true,
		consultations: [],
		upcomingAppointments: [],
		documents: [],
		insurances: [],
		doctors: [],
		allergies: [],
	} ;
}) ( withStyles(styles, { withTheme: true })(PatientDetails) );
