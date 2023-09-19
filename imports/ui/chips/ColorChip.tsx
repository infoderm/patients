import React from 'react';

import {styled} from '@mui/material/styles';

import Chip, {type ChipProps} from '@mui/material/Chip';

import color, {focusColor, hoverColor, textColor} from '../../lib/color';

type Props<C extends React.ElementType> = Omit<ChipProps<C>, 'color'> & {
	readonly color: string;
};

const ColorChip = styled(
	React.forwardRef(
		({color, component, ...rest}: Props<typeof component>, ref) => (
			<Chip ref={ref} component={component} {...rest} />
		),
	),
)(({theme, color: backgroundColor}) => ({
	backgroundColor,
	color:
		backgroundColor && textColor(theme, color(backgroundColor)).toRgbString(),
	'&:hover': {
		backgroundColor:
			backgroundColor &&
			hoverColor(theme, color(backgroundColor)).toRgbString(),
	},
	'&:focus': {
		backgroundColor:
			backgroundColor &&
			focusColor(theme, color(backgroundColor)).toRgbString(),
	},
}));
export default ColorChip;
