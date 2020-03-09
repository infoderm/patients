import React from 'react' ;

import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';

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

export default function PatientHeader ( { patient } ) {

	const classes = useStyles();

	return (
		<Grid className={classes.header} container spacing={3}>
			{(!patient.photo) ? '' :
			<Grid item xs={1}>
			<Avatar
				alt={`${patient.firstname} ${patient.lastname}`}
				src={`data:image/png;base64,${patient.photo}`}
				className={classes.avatar}
				/>
			</Grid>
			}
			<Grid item xs={2}>
				<TextField inputProps={{readOnly: true}} label="Lastname" value={patient.lastname}/>
			</Grid>
			<Grid item xs={2}>
				<TextField inputProps={{readOnly: true}} label="Firstname" value={patient.firstname}/>
			</Grid>
			<Grid item xs={2}>
				<TextField inputProps={{readOnly: true}} label="NISS" value={patient.niss}/>
			</Grid>
			<Grid item xs={2}>
				<TextField inputProps={{readOnly: true}} label="Patient id" value={patient._id}/>
			</Grid>
		</Grid>
	) ;

}
