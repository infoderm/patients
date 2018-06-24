import { Meteor } from 'meteor/meteor' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';

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

function PatientCard ( { classes, theme, patient } ) {

	return (
		<Grid item sm={12} md={12} lg={6} xl={4}>
			<Card className={classes.card} component={Link} to={`/patient/${patient._id}`}>
				<div className={classes.details}>
					<CardHeader
						className={classes.header}
						avatar={
							<Avatar className={classes[patient.sex]}>
								{patient.sex.slice(0,1).toUpperCase()}
							</Avatar>
						}
						title={`${patient.lastname.toUpperCase()} ${patient.firstname}`}
						subheader={new Date(patient.birthdate).toDateString()}
					/>
					<CardContent className={classes.content}>
					</CardContent>
					<CardActions className={classes.actions} disableActionSpacing>
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

PatientCard.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PatientCard);
