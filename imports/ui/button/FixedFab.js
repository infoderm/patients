import React from 'react';
import PropTypes from 'prop-types';

import {useTheme} from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';

import addTooltip from '../accessibility/addTooltip.js';

export const computeFixedFabStyle = ({theme, col, row, style}) => ({
	...style,
	position: 'fixed',
	bottom: theme.spacing(3 + 9 * ((row || FixedFab.defaultProps.row) - 1)),
	right: theme.spacing(3 + 9 * ((col || FixedFab.defaultProps.col) - 1))
});

const FixedFab = React.forwardRef(({col, row, style, ...rest}, ref) => {
	const theme = useTheme();

	style = computeFixedFabStyle({theme, col, row, style});

	return <Fab ref={ref} style={style} {...rest} />;
});

FixedFab.propTypes = {
	col: PropTypes.number,
	row: PropTypes.number
};

FixedFab.defaultProps = {
	col: 1,
	row: 1
};

export default addTooltip(FixedFab);
