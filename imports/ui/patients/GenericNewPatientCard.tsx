import React from 'react';

import {styled} from '@mui/material/styles';

import Button from '@mui/material/Button';
import FaceIcon from '@mui/icons-material/Face';

const PREFIX = 'GenericNewPatientCard';

const classes = {
	buttonTile: `${PREFIX}-buttonTile`,
};

const StyledButton = styled(Button)(() => ({
	[`&.${classes.buttonTile}`]: {
		backgroundColor: '#aaa',
		minHeight: 200,
		fontSize: '1rem',
	},
}));

const GenericNewPatientCard = (props) => {
	return (
		<StyledButton
			fullWidth
			variant="contained"
			className={classes.buttonTile}
			endIcon={<FaceIcon />}
			{...props}
		>
			Add a new patient
		</StyledButton>
	);
};

export default GenericNewPatientCard;
