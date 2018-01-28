import { Meteor } from 'meteor/meteor' ;

import React from 'react' ;
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';

import Card, { CardHeader, CardContent, CardMedia, CardActions } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
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
		<Grid item sm={12} md={4}>
			<Card className={classes.card}>
				<div className={classes.details}>
					<CardHeader
						className={classes.header}
						avatar={
							<Avatar className={classes[patient.sex]}>
								{patient.sex.slice(0,1).toUpperCase()}
							</Avatar>
						}
						title={`${patient.firstname} ${patient.lastname.toUpperCase()}`}
						subheader={new Date(patient.birthdate).toDateString()}
					/>
					<CardContent className={classes.content}>
					</CardContent>
					<CardActions className={classes.actions} disableActionSpacing>
						<IconButton aria-label="Delete" onClick={deleteThisPatient}>
							<DeleteIcon />
						</IconButton>
						<Chip label={patient.niss}/>
					</CardActions>
				</div>
				{ patient.photo ?
				<CardMedia
					className={classes.photo}
					image={`data:image/png;base64,${patient.photo}`}
					title={`${patient.firstname} ${patient.lastname}`}
				/> :
				<div className={classes.photoPlaceHolder}>
					{patient.firstname[0]}{patient.lastname[0]}
				</div>
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
