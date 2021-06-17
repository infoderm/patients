import React from 'react';
import PropTypes, {InferProps} from 'prop-types';

import {Theme} from '@material-ui/core/styles/createMuiTheme';
import {CSSProperties} from '@material-ui/core/styles/withStyles';
import {useTheme} from '@material-ui/core/styles';
import Fab, {FabProps} from '@material-ui/core/Fab';

import addTooltip from '../accessibility/addTooltip.js';

interface Options {
	theme: Theme;
	row?: number;
	col?: number;
	style?: object;
}

export const computeFixedFabStyle = ({
	style,
	theme,
	row,
	col
}: Options): CSSProperties => ({
	...style,
	position: 'fixed',
	bottom: theme?.spacing(3 + 9 * ((row ?? FixedFab.defaultProps.row) - 1)),
	right: theme?.spacing(3 + 9 * ((col ?? FixedFab.defaultProps.col) - 1))
});

const propTypes = {
	col: PropTypes.number,
	row: PropTypes.number,
	style: PropTypes.object,
	component: PropTypes.elementType,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]).isRequired
};

type Props = InferProps<typeof propTypes>;

const FixedFab = React.forwardRef(
	(
		{
			col,
			row,
			style,
			children,
			component,
			...rest
		}: Props & FabProps<typeof component>,
		ref
	) => {
		const theme = useTheme();

		const computedStyle = computeFixedFabStyle({theme, col, row, style});

		return (
			<Fab
				style={computedStyle}
				component={component}
				{...rest}
				ref={ref as any}
			>
				{children}
			</Fab>
		);
	}
);

FixedFab.propTypes = propTypes;

FixedFab.defaultProps = {
	col: 1,
	row: 1
};

export default addTooltip(FixedFab);
