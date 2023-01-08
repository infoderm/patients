import React from 'react';

import {useTheme} from '@mui/material/styles';
import Zoom, {type ZoomProps} from '@mui/material/Zoom';

const FixedFabAnimation = ({in: transitionIn, ...rest}: ZoomProps) => {
	const theme = useTheme();
	const transitionDuration = {
		enter: theme.transitions.duration.enteringScreen,
		exit: theme.transitions.duration.leavingScreen,
	};
	return (
		<Zoom
			unmountOnExit
			in={transitionIn}
			timeout={transitionDuration}
			style={{
				transitionDelay: `${transitionIn ? transitionDuration.exit : 0}ms`,
			}}
			{...rest}
		/>
	);
};

export default FixedFabAnimation;
