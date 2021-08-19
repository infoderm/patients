import React from 'react';

import {makeStyles} from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import FaceIcon from '@material-ui/icons/Face';

const useStyles = makeStyles(() => ({
	buttonTile: {
		minHeight: 200,
		fontSize: '1rem',
	},
}));

const GenericNewPatientCard = (props) => {
	const classes = useStyles();

	return (
		<Button
			fullWidth
			variant="contained"
			className={classes.buttonTile}
			endIcon={<FaceIcon />}
			{...props}
		>
			Add a new patient
		</Button>
	);
};

export default GenericNewPatientCard;
