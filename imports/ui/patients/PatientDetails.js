import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom'

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
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import distanceInWordsStrict from 'date-fns/distance_in_words_strict';
import startOfToday from 'date-fns/start_of_today';

import PatientDeletionDialog from './PatientDeletionDialog.js';

import ConsultationCard from '../consultations/ConsultationCard.js';

import AttachFileButton from '../attachments/AttachFileButton.js';
import AttachmentLink from '../attachments/AttachmentLink.js';
import AttachmentsGallery from '../attachments/AttachmentsGallery.js';

import TagSelector from '../tags/TagSelector.js';

import { Patients } from '../../api/patients.js';
import { Consultations } from '../../api/consultations.js';
import { Insurances } from '../../api/insurances.js';
import { Doctors } from '../../api/doctors.js';
import { Allergies } from '../../api/allergies.js';

const styles = theme => ({
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
			deleting: false,
		};
	}

	componentWillReceiveProps ( nextProps ) {
		this.setState({ patient: nextProps.patient });
	}

	saveDetails = event => {
		Meteor.call('patients.update', this.props.patient._id, this.state.patient , ( err , res ) => {
			if ( err ) console.error(err);
			else {
				this.setState({ editing: false });
			}
		} ) ;
	} ;

	render ( ) {

		const { classes, theme, loading, consultations, insurances, doctors, allergies} = this.props ;
		const { patient , editing , deleting } = this.state;

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

		return (
			<div>
				<Grid container className={classes.container}>
					<Grid item sm={4} md={2}>
						{ patient.photo ?
						<img
							className={classes.photo}
							src={`data:image/png;base64,${patient.photo}`}
							title={`${patient.firstname} ${patient.lastname}`}
						/> :
						<div className={classes.photoPlaceHolder}>
							{patient.firstname[0]}{patient.lastname[0]}
						</div>
						}
						{ !patient.birthdate ? '' :
						<Typography variant="h4">{distanceInWordsStrict(patient.birthdate,startOfToday())}</Typography> }
						{ !patient.noshow ? '' :
						<Typography className={classes.problem} variant="h4">PVPP &gt; 0</Typography> }
					</Grid>
					<Grid item sm={8} md={10}>
						<form>
						<Grid container>
							<Grid item xs={2}>
								<TextField className={classes.formControl}
									label="NISS"
									value={patient.niss}
									onChange={e => this.setState({ patient : { ...patient , niss: e.target.value } } )}
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
									onChange={e => this.setState({ patient : { ...patient , lastname: e.target.value } } )}
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
									onChange={e => this.setState({ patient : { ...patient , firstname: e.target.value } } )}
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
									value={patient.sex}
									onChange={e => this.setState({ patient : { ...patient , sex: e.target.value } } )}
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
								onChange={e => this.setState({ patient : { ...patient , birthdate: e.target.value } } )}
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
								onChange={e => this.setState({ patient : { ...patient , antecedents: e.target.value } } )}
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
								onChange={e => this.setState({ patient : { ...patient , ongoing: e.target.value } } )}
								margin="normal"
							/>
							</Grid>

							<Grid item xs={12} md={12}>
								<TagSelector
									suggestions={allergies}
									itemToKey={x=>x._id}
									itemToString={x=>x.name}
									filter={tagFilter(patient.allergies)}
									readOnly={!editing}
									TextFieldProps={{
										label: "Allergies",
										margin: "normal",
									}}
									chipProps={{
										avatar: <Avatar>Al</Avatar>,
									}}
									value={patient.allergies}
									onChange={e => this.setState({ patient : { ...patient , allergies: e.target.value } } )}
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
								onChange={e => this.setState({ patient : { ...patient , streetandnumber: e.target.value } } )}
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
								onChange={e => this.setState({ patient : { ...patient , zip: e.target.value } } )}
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
								onChange={e => this.setState({ patient : { ...patient , municipality: e.target.value } } )}
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
								onChange={e => this.setState({ patient : { ...patient , phone: e.target.value } } )}
								margin="normal"
							/>
							</Grid>
							<Grid item xs={12} md={4}>
								<TagSelector
									suggestions={doctors}
									itemToKey={x=>x._id}
									itemToString={x=>x.name}
									filter={tagFilter(patient.doctors)}
									readOnly={!editing}
									TextFieldProps={{
										label: "Médecin Traitant",
										margin: "normal",
									}}
									chipProps={{
										avatar: <Avatar>Dr</Avatar>,
									}}
									value={patient.doctors}
									onChange={e => this.setState({ patient : { ...patient , doctors: e.target.value } } )}
									placeholder={placeholder}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<TagSelector
									suggestions={insurances}
									itemToKey={x=>x._id}
									itemToString={x=>x.name}
									filter={tagFilter(patient.insurances)}
									readOnly={!editing}
									TextFieldProps={{
										label: "Mutuelle",
										margin: "normal",
									}}
									chipProps={{
										avatar: <Avatar>In</Avatar>,
									}}
									value={patient.insurances}
									onChange={e => this.setState({ patient : { ...patient , insurances: e.target.value } } )}
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
								className={classes.multiline}
								value={patient.about}
								onChange={e => this.setState({ patient : { ...patient , about: e.target.value } } )}
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
								onChange={e => this.setState({ patient : { ...patient , noshow: e.target.value === '' ? 0 : parseInt(e.target.value,10) } } )}
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
								<Button className={classes.button} color="secondary" onClick={e => this.setState({ editing: false, patient: this.props.patient })}>
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
				<Typography variant="h2">Consultations</Typography>
				<div className={classes.container}>
					{ consultations.map(consultation => ( <ConsultationCard key={consultation._id} consultation={consultation}/> )) }
					<Button className={classes.button} color="default" component={Link} to={`/new/consultation/for/${this.props.patient._id}`}>
						Create a new consultation
						<SupervisorAccountIcon className={classes.rightIcon}/>
					</Button>
				</div>
				{ attachmentsInfo.length === 0 ?
				<Typography variant="h2">No attachments</Typography> :
				<Typography variant="h2">All attachments</Typography> }
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
	Meteor.subscribe('insurances');
	Meteor.subscribe('doctors');
	Meteor.subscribe('allergies');
	if ( handle.ready() ) {
		const patient = Patients.findOne(_id);
		const consultations = Consultations.find({patientId: _id}, {sort: { datetime: -1 }}).fetch();
		const insurances = Insurances.find({}, {sort: { name: 1 }}).fetch();
		const doctors = Doctors.find({}, {sort: { name: 1 }}).fetch();
		const allergies = Allergies.find({}, {sort: { name: 1 }}).fetch();
		return { loading: false, patient, consultations, insurances, doctors, allergies } ;
	}
	else return { loading: true, consultations: [], insurances: [], doctors: [] } ;
}) ( withStyles(styles, { withTheme: true })(PatientDetails) );
