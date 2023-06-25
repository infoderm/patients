import React from 'react';

import {styled} from '@mui/material/styles';

import Button from '@mui/material/Button';
import FaceIcon from '@mui/icons-material/Face';

import color, {focusColor, hoverColor, emphasize} from '../../lib/color';

const StyledButton = styled(Button)(({theme}) => {
	const backgroundColor = emphasize(theme.palette.background.paper, 0.2);
	const textColor = theme.palette.getContrastText(backgroundColor);
	return {
		color: textColor,
		backgroundColor,
		minHeight: 200,
		fontSize: '1.2em',
		'&:hover': {
			backgroundColor: hoverColor(theme, color(backgroundColor)).toRgbString(),
		},
		'&:focus': {
			backgroundColor: focusColor(theme, color(backgroundColor)).toRgbString(),
		},
	};
});

const GenericNewPatientCard = (props) => {
	return (
		<StyledButton
			fullWidth
			variant="contained"
			endIcon={<FaceIcon />}
			{...props}
		>
			Add a new patient
		</StyledButton>
	);
};

export default GenericNewPatientCard;
