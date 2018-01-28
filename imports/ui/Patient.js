import { Meteor } from 'meteor/meteor' ;

import React from 'react' ;
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';

import Card, { CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';

import blue from 'material-ui/colors/blue';
import pink from 'material-ui/colors/pink';

import { Patients } from '../api/patients.js';

const styles = theme => ({
	card: {
		display: 'flex',
		height: 200,
	},
	details: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
	},
	content: {
		flex: '1 0 auto',
	},
	avatar: {
		fontSize: "4em",
		margin: 30,
		width: 140,
		height: 140,
	},
	photo: {
		width: 140,
		height: 200,
	},
	controls: {
		display: 'flex',
		alignItems: 'center',
		paddingLeft: theme.spacing.unit,
		paddingBottom: theme.spacing.unit,
	},
	male: {
		color: '#fff',
		backgroundColor: blue[500],
	},
	female: {
		color: '#fff',
		backgroundColor: pink[500],
	},
	name: {
		display: 'flex',
	},
});

function Patient ( { classes, theme, patient } ) {

	const deleteThisPatient = () => Meteor.call('patients.remove', patient._id);

	return (
		<Grid item sm={12} md={6}>
			<Card className={classes.card}>
				<div className={classes.details}>
					<CardContent className={classes.content}>
						<Typography type="headline">
							<Avatar className={classes[patient.sex]}>{patient.sex[0].toUpperCase()}</Avatar>
							<span className={classes.name}>{patient.firstname} {patient.lastname.toUpperCase()}</span>
							<Chip label={patient.niss}/>
						</Typography>
						<Typography type="subheading" color="textSecondary">
							<span>{new Date(patient.birthdate).toDateString()}</span>
						</Typography>
					</CardContent>
					<div className={classes.control}>
						<IconButton aria-label="Delete" onClick={deleteThisPatient}>
							<DeleteIcon />
						</IconButton>
					</div>
				</div>
				{ patient.photo ?
				<CardMedia
					className={classes.photo}
					image={`data:image/png;base64,${patient.photo}`}
					title={`${patient.firstname} ${patient.lastname}`}
				/> :
				<Avatar className={classes.avatar}>{patient.firstname[0]}{patient.lastname[0]}</Avatar>
				}
			</Card>
		</Grid>
	);
}

Patient.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Patient);
