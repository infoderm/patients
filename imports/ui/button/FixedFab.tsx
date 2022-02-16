import React from 'react';

import {Theme, useTheme} from '@mui/material/styles';
import {CSSProperties} from '@mui/styles';
import Fab, {FabProps} from '@mui/material/Fab';

import addTooltip from '../accessibility/addTooltip';

interface Options {
	theme?: Theme;
	row?: number;
	col?: number;
	style?: object;
}

const DEFAULT_ROW = 1;
const DEFAULT_COL = 1;

export const computeFixedFabStyle = ({
	theme = undefined,
	style = undefined,
	row = DEFAULT_ROW,
	col = DEFAULT_COL,
}: Options): CSSProperties => ({
	...style,
	position: 'fixed',
	bottom: theme?.spacing(3 + 9 * (row - 1)),
	right: theme?.spacing(3 + 9 * (col - 1)),
});

interface FixedFabExtraProps {
	col?: number;
	row?: number;
}

const FixedFab = React.forwardRef(
	(
		{
			col = DEFAULT_COL,
			row = DEFAULT_ROW,
			style = undefined,
			component = undefined,
			...rest
		}: FabProps<typeof component> & FixedFabExtraProps,
		ref,
	) => {
		const theme = useTheme();

		const computedStyle = computeFixedFabStyle({theme, col, row, style});

		return (
			<Fab style={computedStyle} component={component} {...rest} ref={ref} />
		);
	},
);

export default addTooltip(FixedFab);
