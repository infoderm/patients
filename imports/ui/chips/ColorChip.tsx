import React from 'react';

import {styled, darken} from '@mui/material/styles';

import Chip, {type ChipProps} from '@mui/material/Chip';

import {colord} from 'colord';

type Props<C extends React.ElementType> = Omit<ChipProps<C>, 'color'> & {
	color: string;
};

const ColorChip = styled(
	React.forwardRef(
		({color, component, ...rest}: Props<typeof component>, ref) => (
			<Chip ref={ref} component={component} {...rest} />
		),
	),
)(({color}) => {
	const backgroundColor = color;
	const foregroundColor = color
		? colord(color).isLight()
			? '#111'
			: '#ddd'
		: undefined;
	return {
		backgroundColor,
		color: foregroundColor,
		'&:hover, &:focus': {
			backgroundColor: backgroundColor && darken(backgroundColor, 0.1),
		},
	};
});
export default ColorChip;
