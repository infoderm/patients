import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';

import FaceIcon from '@material-ui/icons/Face';

import { Patients } from '../../api/patients.js';

const useStyles = makeStyles(
	theme => ({
		header: {
			backgroundColor: 'white',
			position: 'fixed',
			top: '76px',
			paddingTop: '0.4em',
			zIndex: 10,
			marginLeft: '-24px',
			marginRight: '-24px',
			boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2),0px 4px 5px 0px rgba(0, 0, 0, 0.14),0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
		},
		avatar: {
			width: '48px',
			height: '48px',
		},
	})
);

function PatientHeader ( { patientId , loading , patient } ) {

	const classes = useStyles();

	return (
		<Grid className={classes.header} container spacing={3}>
			<Grid item xs={1}>
			{(!patient || !patient.photo) ?
				<Avatar className={classes.avatar}><FaceIcon/></Avatar>
				:
				<Avatar
					alt={`${patient.firstname} ${patient.lastname}`}
					src={`data:image/png;base64,${patient.photo}`}
					className={classes.avatar}
				/>
			}
			</Grid>
			<Grid item xs={2}>
				<TextField inputProps={{readOnly: true}} label="Lastname" value={!patient ? '?' : patient.lastname}/>
			</Grid>
			<Grid item xs={2}>
				<TextField inputProps={{readOnly: true}} label="Firstname" value={!patient ? '?' : patient.firstname}/>
			</Grid>
			<Grid item xs={2}>
				<TextField inputProps={{readOnly: true}} label="NISS" value={!patient ? '?' : patient.niss}/>
			</Grid>
			<Grid item xs={2}>
				<TextField inputProps={{readOnly: true}} label="Patient id" value={patientId} error={!loading && !patient}/>
			</Grid>
		</Grid>
	) ;

}

PatientHeader.propTypes = {
	patientId: PropTypes.string.isRequired,
	loading: PropTypes.bool.isRequired,
	patient: PropTypes.object,
} ;

export default withTracker(({patientId}) => {

	const handle = Meteor.subscribe('patient', patientId);

	if (handle.ready()) {
		const patient = Patients.findOne(patientId);
		return { patientId , loading: false , patient } ;
	}
	else return { patientId , loading: true } ;

}) (PatientHeader) ;
