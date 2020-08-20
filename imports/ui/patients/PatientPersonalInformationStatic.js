import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {Link} from 'react-router-dom';
import {Prompt} from 'react-router';

import {map, list, filter, take} from '@aureooms/js-itertools';

import {withStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';

import Fab from '@material-ui/core/Fab';
import AddCommentIcon from '@material-ui/icons/AddComment';

import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import UndoIcon from '@material-ui/icons/Undo';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import dateFormat from 'date-fns/format';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import startOfToday from 'date-fns/startOfToday';

import odiff from 'odiff';
import {empty} from '@aureooms/js-cardinality';

import {Insurances} from '../../api/insurances.js';
import {Doctors} from '../../api/doctors.js';
import {Allergies} from '../../api/allergies.js';
import {settings} from '../../api/settings.js';

import eidParseBirthdate from '../../client/eidParseBirthdate.js';

import SetPicker from '../input/SetPicker.js';
import ColorizedTextarea from '../input/ColorizedTextarea.js';

import AllergyChip from '../allergies/AllergyChip.js';

import AttachFileButton from '../attachments/AttachFileButton.js';

import PatientDeletionDialog from './PatientDeletionDialog.js';

const styles = (theme) => ({
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
		marginRight: theme.spacing(2)
	},
	photo: {
		width: 140,
		height: 200,
		verticalAlign: 'top',
		marginRight: theme.spacing(2)
	},
	formControl: {
		margin: theme.spacing(1),
		overflow: 'auto',
		'& input, & div': {
			color: 'black !important'
		}
	},
	container: {
		padding: theme.spacing(3)
	},
	details: {},
	multiline: {
		margin: theme.spacing(1),
		overflow: 'auto',
		width: `calc(100% - ${theme.spacing(2)}px)`,
		'& textarea': {
			color: 'black !important'
		}
	},
	button: {
		margin: theme.spacing(1)
	},
	problem: {
		color: 'red'
	},
	editButton: {
		position: 'fixed',
		bottom: theme.spacing(3),
		right: theme.spacing(3)
	},
	saveButton: {
		position: 'fixed',
		bottom: theme.spacing(3),
		right: theme.spacing(3)
	},
	undoButton: {
		position: 'fixed',
		bottom: theme.spacing(3),
		right: theme.spacing(12)
	},
	attachButton: {
		position: 'fixed',
		bottom: theme.spacing(3),
		right: theme.spacing(12)
	},
	consultationButton: {
		position: 'fixed',
		bottom: theme.spacing(3),
		right: theme.spacing(21)
	},
	deleteButton: {
		position: 'fixed',
		bottom: theme.spacing(3),
		right: theme.spacing(30)
	}
});

const tagFilter = (set) => (suggestions, inputValue) => {
	const notInSet = (x) => (!set ? true : !set.includes(x.name));
	const matches = (x) =>
		!inputValue || x.name.toLowerCase().includes(inputValue.toLowerCase());

	const keep = 5;

	return list(take(filter(notInSet, filter(matches, suggestions)), keep));
};

class PatientPersonalInformation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			patient: props.patient,
			editing: false,
			dirty: false,
			deleting: false
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (!empty(odiff(this.props.patient, nextProps.patient))) {
			this.setState({
				patient: nextProps.patient,
				editing: false,
				dirty: false,
				deleting: false
			});
		}
	}

	saveDetails = (_event) => {
		Meteor.call(
			'patients.update',
			this.props.patient._id,
			this.state.patient,
			(err, _res) => {
				if (err) {
					console.error(err);
				} else {
					this.setState({editing: false, dirty: false});
				}
			}
		);
	};

	render() {
		const {
			classes,
			loading,
			insurances,
			doctors,
			allergies,
			importantStrings
		} = this.props;

		const {patient, editing, dirty, deleting} = this.state;

		if (loading) {
			return <div>Loading...</div>;
		}

		if (!patient) {
			return <div>Error: Patient not found.</div>;
		}

		const placeholder = !editing
			? 'To edit this field you first need to click the edit button'
			: 'Write some information here';

		const minRows = 8;
		const maxRows = 100;

		const update = (key, f = (v) => v) => (e) => {
			this.setState({
				patient: {
					...patient,
					[key]: f(e.target.value)
				},
				dirty: true
			});
		};

		const updateList = (key) => update(key, (v) => list(map((x) => x.name, v)));

		const _birthdate = eidParseBirthdate(patient.birthdate);

		return (
			<div>
				<Prompt
					when={dirty}
					message="You are trying to leave the page while in edit mode. Are you sure you want to continue?"
				/>
				<Grid
					container
					className={classNames(classes.container, classes.details)}
				>
					<Grid item sm={4} md={2}>
						{patient.photo ? (
							<img
								className={classes.photo}
								src={`data:image/png;base64,${patient.photo}`}
								title={`${patient.firstname} ${patient.lastname}`}
							/>
						) : (
							<div className={classes.photoPlaceHolder}>
								{patient.firstname ? patient.firstname[0] : '?'}
								{patient.lastname ? patient.lastname[0] : '?'}
							</div>
						)}
						{!patient.birthdate ? (
							''
						) : (
							<Typography variant="h5">
								{dateFormat(_birthdate, 'd MMM yyyy')}
							</Typography>
						)}
						{!patient.birthdate ? (
							''
						) : (
							<Typography variant="h5">
								{formatDistanceStrict(_birthdate, startOfToday())}
							</Typography>
						)}
						{!patient.noshow ? (
							''
						) : (
							<Typography className={classes.problem} variant="h4">
								PVPP = {patient.noshow}
							</Typography>
						)}
					</Grid>
					<Grid item sm={8} md={10}>
						<form>
							<Grid container>
								<Grid item xs={2}>
									<TextField
										className={classes.formControl}
										label="NISS"
										value={patient.niss}
										inputProps={{
											readOnly: !editing
										}}
										margin="normal"
										onChange={update('niss')}
									/>
								</Grid>
								<Grid item xs={3}>
									<TextField
										className={classes.formControl}
										label="Last name"
										value={patient.lastname}
										inputProps={{
											readOnly: !editing
										}}
										margin="normal"
										onChange={update('lastname')}
									/>
								</Grid>
								<Grid item xs={3}>
									<TextField
										className={classes.formControl}
										label="First name"
										value={patient.firstname}
										inputProps={{
											readOnly: !editing
										}}
										margin="normal"
										onChange={update('firstname')}
									/>
								</Grid>
								<Grid item xs={2}>
									<FormControl className={classes.formControl}>
										<InputLabel htmlFor="sex">Sex</InputLabel>
										<Select
											value={patient.sex || ''}
											inputProps={{
												readOnly: !editing,
												name: 'sex',
												id: 'sex'
											}}
											onChange={update('sex')}
										>
											<MenuItem value="">
												<em>None</em>
											</MenuItem>
											<MenuItem value="female">Female</MenuItem>
											<MenuItem value="male">Male</MenuItem>
											<MenuItem value="other">Other</MenuItem>
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={2}>
									<TextField
										className={classes.formControl}
										type="date"
										disabled={!editing}
										label="Birth date"
										InputLabelProps={{
											shrink: true
										}}
										value={dateFormat(_birthdate, 'yyyy-MM-dd')}
										margin="normal"
										onChange={update('birthdate')}
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
										margin="normal"
										dict={importantStrings}
										onChange={update('antecedents')}
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
										margin="normal"
										dict={importantStrings}
										onChange={update('ongoing')}
									/>
								</Grid>

								<Grid item xs={12} md={12}>
									<SetPicker
										suggestions={allergies}
										itemToKey={(x) => x._id}
										itemToString={(x) => x.name}
										createNewItem={(name) => ({name})}
										filter={tagFilter(patient.allergies)}
										readOnly={!editing}
										TextFieldProps={{
											label: 'Allergies',
											margin: 'normal'
										}}
										chip={AllergyChip}
										chipProps={{
											avatar: <Avatar>Al</Avatar>
										}}
										value={list(
											map((x) => ({name: x}), patient.allergies || [])
										)}
										placeholder={placeholder}
										onChange={updateList('allergies')}
									/>
								</Grid>

								<Grid item xs={12} md={6}>
									<TextField
										multiline
										inputProps={{
											readOnly: !editing
										}}
										label="Rue et Numéro"
										placeholder={placeholder}
										rows={1}
										className={classes.multiline}
										value={patient.streetandnumber}
										margin="normal"
										onChange={update('streetandnumber')}
									/>
								</Grid>
								<Grid item xs={12} md={2}>
									<TextField
										multiline
										inputProps={{
											readOnly: !editing
										}}
										label="Code Postal"
										placeholder={placeholder}
										rows={1}
										className={classes.multiline}
										value={patient.zip}
										margin="normal"
										onChange={update('zip')}
									/>
								</Grid>
								<Grid item xs={12} md={4}>
									<TextField
										multiline
										inputProps={{
											readOnly: !editing
										}}
										label="Commune"
										placeholder={placeholder}
										rows={1}
										className={classes.multiline}
										value={patient.municipality}
										margin="normal"
										onChange={update('municipality')}
									/>
								</Grid>

								<Grid item xs={12} md={4}>
									<TextField
										multiline
										inputProps={{
											readOnly: !editing
										}}
										label="Numéro de téléphone"
										placeholder={placeholder}
										rows={1}
										className={classes.multiline}
										value={patient.phone}
										margin="normal"
										onChange={update('phone')}
									/>
								</Grid>
								<Grid item xs={12} md={4}>
									<SetPicker
										suggestions={doctors}
										itemToKey={(x) => x._id}
										itemToString={(x) => x.name}
										createNewItem={(name) => ({name})}
										filter={tagFilter(patient.doctors)}
										readOnly={!editing}
										TextFieldProps={{
											label: 'Médecin Traitant',
											margin: 'normal'
										}}
										chipProps={{
											avatar: <Avatar>Dr</Avatar>
										}}
										value={list(map((x) => ({name: x}), patient.doctors || []))}
										placeholder={placeholder}
										onChange={updateList('doctors')}
									/>
								</Grid>
								<Grid item xs={12} md={4}>
									<SetPicker
										suggestions={insurances}
										itemToKey={(x) => x._id}
										itemToString={(x) => x.name}
										createNewItem={(name) => ({name})}
										filter={tagFilter(patient.insurances)}
										readOnly={!editing}
										TextFieldProps={{
											label: 'Mutuelle',
											margin: 'normal'
										}}
										chipProps={{
											avatar: <Avatar>In</Avatar>
										}}
										value={list(
											map((x) => ({name: x}), patient.insurances || [])
										)}
										placeholder={placeholder}
										onChange={updateList('insurances')}
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
										margin="normal"
										dict={importantStrings}
										onChange={update('about')}
									/>
								</Grid>
								<Grid item xs={3}>
									<TextField
										inputProps={{
											readOnly: !editing
										}}
										label="PVPP"
										placeholder={placeholder}
										className={classes.multiline}
										value={patient.noshow || 0}
										margin="normal"
										onChange={update('noshow', (v) =>
											v === '' ? 0 : Number.parseInt(v, 10)
										)}
									/>
								</Grid>
							</Grid>
						</form>
					</Grid>
				</Grid>
				{editing ? (
					<>
						<Fab
							className={classes.saveButton}
							color="primary"
							disabled={!dirty}
							onClick={this.saveDetails}
						>
							<SaveIcon />
						</Fab>
						<Fab
							className={classes.undoButton}
							color={dirty ? 'secondary' : 'default'}
							onClick={() =>
								this.setState({
									editing: false,
									dirty: false,
									patient: this.props.patient
								})
							}
						>
							<UndoIcon />
						</Fab>
					</>
				) : (
					<>
						<Fab
							className={classes.editButton}
							color="default"
							onClick={() => this.setState({editing: true})}
						>
							<EditIcon />
						</Fab>
						<AttachFileButton
							Button={Fab}
							className={classes.attachButton}
							color="default"
							method="patients.attach"
							item={patient._id}
						>
							<AttachFileIcon />
						</AttachFileButton>
						<Fab
							className={classes.consultationButton}
							color="primary"
							component={Link}
							to={`/new/consultation/for/${patient._id}`}
						>
							<AddCommentIcon />
						</Fab>
						<Fab
							className={classes.deleteButton}
							color="secondary"
							onClick={() => this.setState({deleting: true})}
						>
							<DeleteIcon />
						</Fab>
					</>
				)}
				<PatientDeletionDialog
					open={deleting}
					patient={this.props.patient}
					onClose={() => this.setState({deleting: false})}
				/>
			</div>
		);
	}
}

PatientPersonalInformation.propTypes = {
	classes: PropTypes.object.isRequired,
	patient: PropTypes.object.isRequired
};

export default withTracker(() => {
	Meteor.subscribe('insurances');
	Meteor.subscribe('doctors');
	Meteor.subscribe('allergies');
	settings.subscribe('important-strings');

	const insurances = Insurances.find({}, {sort: {name: 1}}).fetch();
	const doctors = Doctors.find({}, {sort: {name: 1}}).fetch();
	const allergies = Allergies.find({}, {sort: {name: 1}}).fetch();
	const importantStrings = settings.get('important-strings');
	return {
		insurances,
		doctors,
		allergies,
		importantStrings
	};
})(withStyles(styles, {withTheme: true})(PatientPersonalInformation));
