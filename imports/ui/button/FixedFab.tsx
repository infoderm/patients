import React from 'react';
import PropTypes, {InferProps} from 'prop-types';

import {Theme} from '@material-ui/core/styles/createMuiTheme';
import {CSSProperties} from '@material-ui/core/styles/withStyles';
import {useTheme} from '@material-ui/core/styles';
import Fab, {FabProps} from '@material-ui/core/Fab';

import addTooltip from '../accessibility/addTooltip';

interface Options {
	theme: Theme;
	row?: number;
	col?: number;
	style?: object;
}

const DEFAULT_ROW = 1;
const DEFAULT_COL = 1;

export const computeFixedFabStyle = ({
	style,
	theme,
	row = DEFAULT_ROW,
	col = DEFAULT_COL,
}: Options): CSSProperties => ({
	...style,
	position: 'fixed',
	bottom: theme?.spacing(3 + 9 * (row - 1)),
	right: theme?.spacing(3 + 9 * (col - 1)),
});

const propTypes = {
	col: PropTypes.number,
	row: PropTypes.number,
	style: PropTypes.object,
	component: PropTypes.elementType,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]).isRequired,
};

type Props = InferProps<typeof propTypes>;

const FixedFab = React.forwardRef(
	(
		{
			col = DEFAULT_COL,
			row = DEFAULT_ROW,
			style,
			children,
			component,
			...rest
		}: Props & FabProps<typeof component>,
		ref,
	) => {
		const theme = useTheme();

		const computedStyle = computeFixedFabStyle({theme, col, row, style});

		return (
			<Fab style={computedStyle} component={component} {...rest} ref={ref}>
				{children}
			</Fab>
		);
	},
);

FixedFab.propTypes = propTypes;

export default addTooltip(FixedFab);
