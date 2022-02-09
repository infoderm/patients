import React from 'react';

import makeStyles from '@mui/styles/makeStyles';

import Button from '@mui/material/Button';
import FaceIcon from '@mui/icons-material/Face';

const useStyles = makeStyles(() => ({
	buttonTile: {
		backgroundColor: '#aaa',
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
