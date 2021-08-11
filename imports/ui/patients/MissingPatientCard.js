import React from 'react';

import {makeStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ErrorIcon from '@material-ui/icons/Error';

const useStyles = makeStyles((theme) => ({
	buttonTile: {
		minHeight: 200,
		width: '100%',
		fontSize: '1rem',
	},
	rightIcon: {
		marginLeft: theme.spacing(1),
	},
}));

export default function MissingPatientCard({patientId}) {
	const classes = useStyles();

	return (
		<Grid item sm={12} md={12} lg={6} xl={4}>
			<Button variant="contained" className={classes.buttonTile}>
				Missing patient #{patientId}
				<ErrorIcon className={classes.rightIcon} />
			</Button>
		</Grid>
	);
}
