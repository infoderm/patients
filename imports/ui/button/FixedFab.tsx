import React, {type CSSProperties} from 'react';

import {styled, type Theme, useTheme} from '@mui/material/styles';
import Fab, {type FabProps} from '@mui/material/Fab';
import CircularProgress from '@mui/material/CircularProgress';

import addTooltip from '../accessibility/addTooltip';
import FixedFabAnimation from './FixedFabAnimation';

type Options = {
	theme?: Theme;
	row?: number;
	col?: number;
	style?: object;
};

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

type FixedFabExtraProps = {
	col?: number;
	row?: number;
	visible?: boolean;
	pending?: boolean;
};

const Progress = styled(CircularProgress)({
	position: 'absolute',
	top: -6,
	left: -6,
	zIndex: 1,
});

const FixedFab = React.forwardRef(
	(
		{
			col = DEFAULT_COL,
			row = DEFAULT_ROW,
			visible = true,
			pending = false,
			disabled,
			style = undefined,
			component = undefined,
			...rest
		}: FabProps<typeof component> & FixedFabExtraProps,
		ref,
	) => {
		const theme = useTheme();

		const computedStyle = computeFixedFabStyle({theme, col, row, style});

		return (
			<FixedFabAnimation in={visible}>
				<div style={computedStyle}>
					<Fab
						ref={ref}
						component={component}
						disabled={disabled || pending}
						{...rest}
					/>
					{pending && <Progress size={68} />}
				</div>
			</FixedFabAnimation>
		);
	},
);

export default addTooltip(FixedFab);
