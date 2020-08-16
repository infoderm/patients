import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React, {Fragment} from 'react' ;
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
import Fab from '@material-ui/core/Fab';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import UndoIcon from '@material-ui/icons/Undo';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import dateFormat from 'date-fns/format';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import startOfToday from 'date-fns/startOfToday';

import odiff from 'odiff' ;
import { empty } from '@aureooms/js-cardinality' ;

import { Insurances } from '../../api/insurances.js';
import { Doctors } from '../../api/doctors.js';
import { Allergies } from '../../api/allergies.js';
import { settings } from '../../api/settings.js';

import eidParseBirthdate from '../../client/eidParseBirthdate.js';

import SetPicker from '../input/SetPicker.js';
import ColorizedTextarea from '../input/ColorizedTextarea.js';

import AllergyChip from '../allergies/AllergyChip.js';

import AttachFileButton from '../attachments/AttachFileButton.js';

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
		marginRight: theme.spacing(2),
	},
	photo: {
		width: 140,
		height: 200,
		verticalAlign: 'top',
		marginRight: theme.spacing(2),
	},
	formControl: {
		margin: theme.spacing(1),
		overflow: 'auto',
		'& input, & div' : {
			color: 'black !important',
		} ,
	},
	container: {
		padding: theme.spacing(3),
	},
	details: {
	},
	multiline: {
		margin: theme.spacing(1),
		overflow: 'auto',
		width: `calc(100% - ${theme.spacing(2)}px)`,
		'& textarea' : {
			color: 'black !important',
		} ,
	},
	button: {
		margin: theme.spacing(1),
	},
	problem:{
		color: 'red',
	},
    editButton: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(3),
    },
    saveButton: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(3),
    },
    undoButton: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(12),
    },
    attachButton: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(12),
    },
    consultationButton: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(21),
    },
    deleteButton: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(30),
    },
});

const tagFilter = set => (suggestions, inputValue) => {

	const notInSet = x => !set ? true : set.indexOf(x.name)===-1 ;
	const matches = x => !inputValue || x.name.toLowerCase().includes(inputValue.toLowerCase()) ;

	const keep = 5 ;

	return list( take( filter(notInSet, filter(matches, suggestions) ) , keep ) ) ;

} ;

class PatientPersonalInformation extends React.Component {

	constructor ( props ) {
		super(props);
		this.state = {
			patient: props.patient,
			editing: false,
			dirty: false,
			deleting: false,
		};
	}

	UNSAFE_componentWillReceiveProps ( nextProps ) {
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
			insurances,
			doctors,
			allergies,
			importantStrings,
		} = this.props ;

		const { patient , editing , dirty , deleting } = this.state;

		if (loading) return <div>Loading...</div>;
		if (!patient) return <div>Error: Patient not found.</div>;

		const placeholder = !editing ? "To edit this field you first need to click the edit button" : "Write some information here";

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

		const _birthdate = eidParseBirthdate(patient.birthdate) ;

		return (
			<div>
				<Prompt
					when={dirty}
					message="You are trying to leave the page while in edit mode. Are you sure you want to continue?"
				/>
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
						<Typography variant="h5">{dateFormat(_birthdate,'d MMM yyyy')}</Typography> }
						{ !patient.birthdate ? '' :
						<Typography variant="h5">{formatDistanceStrict(_birthdate,startOfToday())}</Typography> }
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
								value={dateFormat(_birthdate, 'yyyy-MM-dd')}
								onChange={update('birthdate')}
								margin="normal"
							/>
							</Grid>
							<Grid item xs={12} md={6}>
							<ColorizedTextarea
								readOnly={!editing}
								label="Antécédents"
								placeholder={placeholder}
								rows={minRows}
								rowsMax={maxRows}
								className={classes.multiline}
								value={patient.antecedents}
								onChange={update('antecedents')}
								margin="normal"
								dict={importantStrings}
							/>
							</Grid>
							<Grid item xs={12} md={6}>
							<ColorizedTextarea
								readOnly={!editing}
								label="Traitement en cours"
								placeholder={placeholder}
								rows={minRows}
								rowsMax={maxRows}
								className={classes.multiline}
								value={patient.ongoing}
								onChange={update('ongoing')}
								margin="normal"
								dict={importantStrings}
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
							<ColorizedTextarea
								readOnly={!editing}
								label="About"
								placeholder={placeholder}
								rows={2}
								rowsMax={maxRows}
								className={classes.multiline}
								value={patient.about}
								onChange={update('about')}
								margin="normal"
								dict={importantStrings}
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
				</Grid>
				<Fragment>
					{ editing ?
					<Fragment>
						<Fab className={classes.saveButton} color="primary" disabled={!dirty} onClick={this.saveDetails}>
							<SaveIcon/>
						</Fab>
						<Fab className={classes.undoButton} color={dirty ? 'secondary' : 'default'} onClick={e => this.setState({ editing: false, dirty: false, patient: this.props.patient })}>
							<UndoIcon/>
						</Fab>
					</Fragment>:
					<Fragment>
						<Fab className={classes.editButton} color="default" onClick={e => this.setState({ editing: true })}>
							<EditIcon/>
						</Fab>
						<AttachFileButton Button={Fab} className={classes.attachButton} color="default" method="patients.attach" item={patient._id}>
							<AttachFileIcon/>
						</AttachFileButton>
						<Fab className={classes.consultationButton} color="primary" component={Link} to={`/new/consultation/for/${patient._id}`}>
							<SupervisorAccountIcon/>
						</Fab>
						<Fab className={classes.deleteButton} color="secondary" onClick={e => this.setState({ deleting: true})}>
							<DeleteIcon/>
						</Fab>
					</Fragment>
					}
					<PatientDeletionDialog open={deleting} onClose={e => this.setState({ deleting: false})} patient={this.props.patient}/>
				</Fragment>
			</div>
		);
	}

}

PatientPersonalInformation.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	patient: PropTypes.object.isRequired,
};

export default withTracker(() => {
	Meteor.subscribe('insurances');
	Meteor.subscribe('doctors');
	Meteor.subscribe('allergies');
	settings.subscribe('important-strings');

	const insurances = Insurances.find({}, {sort: { name: 1 }}).fetch();
	const doctors = Doctors.find({}, {sort: { name: 1 }}).fetch();
	const allergies = Allergies.find({}, {sort: { name: 1 }}).fetch();
	const importantStrings = settings.get('important-strings');
	return {
		insurances,
		doctors,
		allergies,
		importantStrings,
	} ;
}) ( withStyles(styles, { withTheme: true })(PatientPersonalInformation) );
