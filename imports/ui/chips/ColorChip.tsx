import React from 'react';

import makeStyles from '@mui/styles/makeStyles';
import {darken} from '@mui/material/styles';
import classNames from 'classnames';

import Chip, {type ChipProps} from '@mui/material/Chip';

import {colord} from 'colord';

const styles = {
	chip({color}) {
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
	},
};

const useStyles = makeStyles(styles);

type ColorChipExtraProps = {
	color?: string;
};

const ColorChip = React.forwardRef(
	(
		{
			color,
			className,
			component,
			...rest
		}: ColorChipExtraProps & Omit<ChipProps<typeof component>, 'color'>,
		ref,
	) => {
		const classes = useStyles({color});
		return (
			<Chip
				ref={ref}
				component={component}
				className={classNames(classes.chip, className)}
				{...rest}
			/>
		);
	},
);

export default ColorChip;
