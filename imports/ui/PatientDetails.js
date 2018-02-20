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
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';

import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import TextField from 'material-ui/TextField'
import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu'

import { Patients } from '../api/patients.js';
import { Consultations } from '../api/consultations.js';

import ConsultationCard from './ConsultationCard.js';

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
	},
	container: {
		padding: theme.spacing.unit * 3,
	},
	about: {
		margin: theme.spacing.unit,
		overflow: 'auto',
		width: `calc(100% - ${theme.spacing.unit*2}px)`,
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
		};
	}

	componentWillReceiveProps ( nextProps ) {
		this.setState({ patient: nextProps.patient });
	}

	render ( ) {

		const { classes, theme, loading, consultations } = this.props ;
		const { patient } = this.state;

		if (loading) return <div>Loading...</div>;
		if (!patient) return <div>Error: Patient not found.</div>;

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
							<TextField className={classes.formControl} label="NISS" value={patient.niss} onChange={e => this.setState({ niss: e.target.value})} disabled={true} margin="normal"/>
							<TextField className={classes.formControl} label="First name" value={patient.firstname} onChange={e => this.setState({ firstname: e.target.value})} disabled={true} margin="normal"/>
							<TextField className={classes.formControl} label="Last name" value={patient.lastname} onChange={e => this.setState({ lastname: e.target.value})} disabled={true} margin="normal"/>
							<FormControl className={classes.formControl} disabled={true}>
								<InputLabel htmlFor="sex">Sex</InputLabel>
								<Select
									value={patient.sex}
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
								value={patient.birthdate}
								onChange={e => this.setState({ birthdate: e.target.value})}
								margin="normal"
							/>
							<TextField
								disabled={true}
								label="About"
								placeholder="Write some information here"
								multiline
								rows={4}
								className={classes.about}
								value={patient.about}
								onChange={e => this.setState({ about: e.target.value})}
								margin="normal"
							/>
						</form>
					</Grid>
				</Grid>
				<Typography variant="display3">Consultations</Typography>
				<div className={classes.container}>
					{ consultations.map(consultation => ( <ConsultationCard key={consultation._id} consultation={consultation}/> )) }
					<Button className={classes.button} color="default" component={Link} to={`/new/consultation/for/${patient._id}`}>
						Create a new consultation
						<SupervisorAccountIcon className={classes.rightIcon}/>
					</Button>
				</div>
				<Typography variant="display3">Prescriptions</Typography>
				<div className={classes.container}>
				</div>
				<Typography variant="display3">Appointments</Typography>
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
	Meteor.subscribe('patient.consultations', _id);
	if ( handle.ready() ) {
		const patient = Patients.findOne(_id);
		const consultations = Consultations.find({}, {sort: { datetime: -1 }}).fetch();
		return { loading: false, patient, consultations } ;
	}
	else return { loading: true } ;
}) ( withStyles(styles, { withTheme: true })(PatientDetails) );
