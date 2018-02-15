import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom'

import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';

import Card, { CardHeader, CardContent, CardMedia, CardActions } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';

import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import TextField from 'material-ui/TextField'
import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu'

import blue from 'material-ui/colors/blue';
import pink from 'material-ui/colors/pink';

import { Patients } from '../api/patients.js';

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
		display: 'inline-flex',
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
	},
	container: {
		padding: theme.spacing.unit * 3,
	},
});

class PatientDetails extends React.Component {

	constructor ( props ) {
		super(props);
		this.state = {};
	}

	componentWillReceiveProps ( nextProps ) {
		this.setState(nextProps.patient);
	}

	render ( ) {

		const { classes, theme, loading, patient } = this.props ;

		if (loading) return <div>Loading...</div>;
		if (!patient) return <div>Error: Patient not found.</div>;

		const deleteThisPatient = ( event ) => {
			event.preventDefault();
			Meteor.call('patients.remove', patient._id);
		};

		return (
			<div>
				<Typography variant="display3">Details</Typography>
				<div className={classes.container}>
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
					<TextField className={classes.formControl} label="NISS" value={this.state.niss} onChange={e => this.setState({ niss: e.target.value})} disabled={true}/>
					<TextField className={classes.formControl} label="First name" value={this.state.firstname} onChange={e => this.setState({ firstname: e.target.value})} disabled={true}/>
					<TextField className={classes.formControl} label="Last name" value={this.state.lastname} onChange={e => this.setState({ lastname: e.target.value})} disabled={true}/>
					<FormControl className={classes.formControl} disabled={true}>
						<InputLabel htmlFor="sex">Sex</InputLabel>
						<Select
							value={this.state.sex}
							onChange={e => this.setState({ sex: e.target.value})}
							inputProps={{
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
					<TextField className={classes.formControl} type="date"
						disabled={true}
						label="Birth date"
						InputLabelProps={{
						  shrink: true,
						}}
						value={this.state.birthdate}
						onChange={e => this.setState({ birthdate: e.target.value})}
					/>
				</div>
				<Typography variant="display3">Appointments</Typography>
				<div className={classes.container}>
				</div>
				<Typography variant="display3">Prescriptions</Typography>
				<div className={classes.container}>
				</div>
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
	if ( handle.ready() ) {
		const patient = Patients.findOne(_id);
		return { loading: false, patient } ;
	}
	else return { loading: true } ;
}) ( withStyles(styles, { withTheme: true })(PatientDetails) );
