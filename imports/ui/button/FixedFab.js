import React from 'react';
import PropTypes from 'prop-types';

import {useTheme} from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

export const computeFixedFabStyle = ({theme, col, row, style}) => ({
	...style,
	position: 'fixed',
	bottom: theme.spacing(3 + 9 * ((row || FixedFab.defaultProps.row) - 1)),
	right: theme.spacing(3 + 9 * ((col || FixedFab.defaultProps.col) - 1))
});

const FixedFab = ({col, row, style, tooltip, ...rest}) => {
	const theme = useTheme();

	style = computeFixedFabStyle({theme, col, row, style});

	const fab = <Fab style={style} {...rest} />;

	if (tooltip) {
		return (
			<Tooltip title={tooltip} aria-label={tooltip}>
				{fab}
			</Tooltip>
		);
	}

	return fab;
};

FixedFab.propTypes = {
	col: PropTypes.number,
	row: PropTypes.number,
	tooltip: PropTypes.string
};

FixedFab.defaultProps = {
	col: 1,
	row: 1
};

export default FixedFab;
