import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom'

import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';

import Card, { CardHeader, CardContent, CardMedia, CardActions } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

import Button from 'material-ui/Button';
import SupervisorAccountIcon from 'material-ui-icons/SupervisorAccount';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import SaveIcon from 'material-ui-icons/Save';
import UndoIcon from 'material-ui-icons/Undo';

import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import TextField from 'material-ui/TextField'
import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu'

import { Patients } from '../api/patients.js';
import { Consultations } from '../api/consultations.js';

import ConsultationCard from './ConsultationCard.js';
import PatientDeletionDialog from './PatientDeletionDialog.js';

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
});

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
			if ( err ) console.log(err);
			else {
				this.setState({ editing: false });
			}
		} ) ;
	} ;

	render ( ) {

		const { classes, theme, loading, consultations } = this.props ;
		const { patient , editing , deleting } = this.state;

		if (loading) return <div>Loading...</div>;
		if (!patient) return <div>Error: Patient not found.</div>;

		const placeholder = !editing ? "To edit this field you first need to click the edit button" : "Write some information here";

		return (
			<div>
				<Typography variant="display3">Details</Typography>
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
					</Grid>
					<Grid item sm={8} md={10}>
						<form>
						<Grid container>
							<Grid item xs={2}>
								<TextField className={classes.formControl}
									label="NISS"
									value={patient.niss}
									onChange={e => this.setState({ patient : { ...this.state.patient , niss: e.target.value } } )}
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
									onChange={e => this.setState({ patient : { ...this.state.patient , lastname: e.target.value } } )}
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
									onChange={e => this.setState({ patient : { ...this.state.patient , firstname: e.target.value } } )}
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
									onChange={e => this.setState({ patient : { ...this.state.patient , sex: e.target.value } } )}
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
								onChange={e => this.setState({ patient : { ...this.state.patient , birthdate: e.target.value } } )}
								margin="normal"
							/>
							</Grid>
							<Grid item xs={12} md={4}>
							<TextField
								inputProps={{
									readOnly: !editing,
								}}
								label="Antécédents"
								placeholder={placeholder}
								multiline
								rows={8}
								className={classes.multiline}
								value={patient.antecedents}
								onChange={e => this.setState({ patient : { ...this.state.patient , antecedents: e.target.value } } )}
								margin="normal"
							/>
							</Grid>
							<Grid item xs={12} md={4}>
							<TextField
								inputProps={{
									readOnly: !editing,
								}}
								label="Allergies"
								placeholder={placeholder}
								multiline
								rows={8}
								className={classes.multiline}
								value={patient.allergies}
								onChange={e => this.setState({ patient : { ...this.state.patient , allergies: e.target.value } } )}
								margin="normal"
							/>
							</Grid>
							<Grid item xs={12} md={4}>
							<TextField
								inputProps={{
									readOnly: !editing,
								}}
								label="Traitement en cours"
								placeholder={placeholder}
								multiline
								rows={8}
								className={classes.multiline}
								value={patient.ongoing}
								onChange={e => this.setState({ patient : { ...this.state.patient , ongoing: e.target.value } } )}
								margin="normal"
							/>
							</Grid>

							<Grid item xs={12} md={4}>
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
								onChange={e => this.setState({ patient : { ...this.state.patient , streetandnumber: e.target.value } } )}
								margin="normal"
							/>
							</Grid>
							<Grid item xs={12} md={4}>
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
								onChange={e => this.setState({ patient : { ...this.state.patient , zip: e.target.value } } )}
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
								onChange={e => this.setState({ patient : { ...this.state.patient , municipality: e.target.value } } )}
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
								onChange={e => this.setState({ patient : { ...this.state.patient , phone: e.target.value } } )}
								margin="normal"
							/>
							</Grid>
							<Grid item xs={12} md={4}>
							<TextField
								inputProps={{
									readOnly: !editing,
								}}
								label="Médecin Traitant"
								placeholder={placeholder}
								multiline
								rows={1}
								className={classes.multiline}
								value={patient.doctor}
								onChange={e => this.setState({ patient : { ...this.state.patient , doctor: e.target.value } } )}
								margin="normal"
							/>
							</Grid>
							<Grid item xs={12} md={4}>
							<TextField
								inputProps={{
									readOnly: !editing,
								}}
								label="Mutuelle"
								placeholder={placeholder}
								multiline
								rows={1}
								className={classes.multiline}
								value={patient.insurance}
								onChange={e => this.setState({ patient : { ...this.state.patient , insurance: e.target.value } } )}
								margin="normal"
							/>
							</Grid>



							<Grid item xs={12}>
							<TextField
								inputProps={{
									readOnly: !editing,
								}}
								label="About"
								placeholder={placeholder}
								multiline
								rows={4}
								className={classes.multiline}
								value={patient.about}
								onChange={e => this.setState({ patient : { ...this.state.patient , about: e.target.value } } )}
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
				<Typography variant="display3">Consultations</Typography>
				<div className={classes.container}>
					{ consultations.map(consultation => ( <ConsultationCard key={consultation._id} consultation={consultation}/> )) }
					<Button className={classes.button} color="default" component={Link} to={`/new/consultation/for/${this.props.patient._id}`}>
						Create a new consultation
						<SupervisorAccountIcon className={classes.rightIcon}/>
					</Button>
				</div>
				{ false && ( <div>
				<Typography variant="display3">Prescriptions</Typography>
				<div className={classes.container}>
				</div>
				<Typography variant="display3">Appointments</Typography>
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
	if ( handle.ready() ) {
		const patient = Patients.findOne(_id);
		const consultations = Consultations.find({}, {sort: { datetime: -1 }}).fetch();
		return { loading: false, patient, consultations } ;
	}
	else return { loading: true } ;
}) ( withStyles(styles, { withTheme: true })(PatientDetails) );
