import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

const addTooltip = (Component) => ({tooltip, ...rest}) => {
	return tooltip ? (
		<Tooltip title={tooltip} aria-label={tooltip}>
			<Component {...rest} />
		</Tooltip>
	) : (
		<Component {...rest} />
	);
};

export default addTooltip;
