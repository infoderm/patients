import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

import Button from '@material-ui/core/Button';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import green from '@material-ui/core/colors/green';

import DoctorDeletionDialog from './DoctorDeletionDialog.js';
import DoctorRenamingDialog from './DoctorRenamingDialog.js';

import { Patients } from '../../api/patients.js';

const styles = theme => ({
	card: {
		display: 'flex',
		minHeight: 200,
	},
	details: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
	},
	header: {
		flex: '1 0 auto',
	},
	content: {
		flex: '1 0 auto',
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
	},
	photo: {
		width: 140,
		height: 200,
	},
	actions: {
		display: 'flex',
		paddingLeft: theme.spacing.unit * 2,
	},
	avatar: {
		color: '#fff',
		backgroundColor: green[500],
	},
	patientchip: {
		marginRight: theme.spacing.unit,
		backgroundColor: '#aaa',
		color: '#fff',
	},
	name: {
		display: 'flex',
	},
});

class DoctorCard extends React.Component {

	constructor (props) {
		super(props)
		this.state = {
			deleting: false,
			renaming: false,
		};
	}

	render () {

		const { classes, theme, doctor, loading, patients } = this.props ;
		const { deleting , renaming } = this.state ;

		return (
			<Grid item sm={12} md={12} lg={6} xl={4}>
			<Card className={classes.card}>
			<div className={classes.details}>
			<CardHeader
			className={classes.header}
			avatar={
				<Avatar className={classes.avatar}>
				DR
				</Avatar>
			}
			title={doctor.name}
			subheader={loading ? '...' : `soigne ${patients.length} patients`}
 			component={Link} to={`/doctor/${doctor.name}`}
			/>
			<CardContent className={classes.content}>
			{loading ? '...' : patients.slice(0,2).map(patient => (
				<Chip
				key={patient._id}
				avatar={patient.photo? <Avatar src={`data:image/png;base64,${patient.photo}`}/> : null}
				label={`${patient.lastname} ${patient.firstname}`}
				className={classes.patientchip}
				component={Link}
				to={`/patient/${patient._id}`}
				/>
			))}
			{!loading && patients.length > 2 && `et ${patients.length - 2} autres`}
			</CardContent>
			<CardActions className={classes.actions} disableActionSpacing>
			<Button color="primary" onClick={e => this.setState({ renaming: true})}>
			Rename<EditIcon/>
			</Button>
			<Button color="secondary" onClick={e => this.setState({ deleting: true})}>
			Delete<DeleteIcon/>
			</Button>
			<DoctorRenamingDialog open={renaming} onClose={e => this.setState({ renaming: false})} doctor={doctor}/>
			<DoctorDeletionDialog open={deleting} onClose={e => this.setState({ deleting: false})} doctor={doctor}/>
			</CardActions>
			</div>
			<div className={classes.photoPlaceHolder}>
			{doctor.name[0]}
			</div>
			</Card>
			</Grid>
		);

	}
}

DoctorCard.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	doctor: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired,
};

export default withTracker(({doctor}) => {
	const name = doctor.name;
	const handle = Meteor.subscribe('patients-of-doctor', name);
	if ( handle.ready() ) {
		const patients = Patients.find({doctor: name}).fetch();
		return { loading: false, patients } ;
	}
	else return { loading: true } ;
}) ( withStyles(styles, { withTheme: true})(DoctorCard) ) ;
