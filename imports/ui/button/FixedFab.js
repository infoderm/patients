import React from 'react';
import PropTypes from 'prop-types';

import {useTheme} from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';

export const computeFixedFabStyle = ({theme, col, row, style}) => ({
	...style,
	position: 'fixed',
	bottom: theme.spacing(3 + 9 * ((row || FixedFab.defaultProps.row) - 1)),
	right: theme.spacing(3 + 9 * ((col || FixedFab.defaultProps.col) - 1))
});

const FixedFab = ({col, row, style, ...rest}) => {
	const theme = useTheme();

	style = computeFixedFabStyle({theme, col, row, style});

	return <Fab style={style} {...rest} />;
};

FixedFab.propTypes = {
	col: PropTypes.number,
	row: PropTypes.number
};

FixedFab.defaultProps = {
	col: 1,
	row: 1
};

export default FixedFab;
