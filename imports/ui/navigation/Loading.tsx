import React from 'react';
import ReactLoading from 'react-loading';

import {styled, useTheme} from '@mui/material/styles';

const StyledAnimation = styled(ReactLoading)({
	margin: 'auto',
});

const Loading = (props) => {
	const theme = useTheme();
	return (
		<div>
			<StyledAnimation
				type="bubbles"
				color={theme.palette.primary.main}
				height={200}
				width={400}
				delay={250}
				{...props}
			/>
		</div>
	);
};

export default Loading;
