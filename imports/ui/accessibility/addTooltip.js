import React from 'react';
import Tooltip from './Tooltip.js';

const addTooltip = (Component, transform = (_props, x) => x) => ({
	tooltip,
	...rest
}) => {
	tooltip = transform(rest, tooltip);

	return tooltip ? (
		<Tooltip title={tooltip} aria-label={tooltip}>
			<Component {...rest} />
		</Tooltip>
	) : (
		<Component {...rest} />
	);
};

export default addTooltip;
