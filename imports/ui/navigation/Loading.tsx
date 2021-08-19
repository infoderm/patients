import React from 'react';
import ReactLoading from 'react-loading';

import {useTheme, makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
	loadingAnimation: {
		margin: 'auto',
	},
}));

const Loading = (props) => {
	const theme = useTheme();
	const classes = useStyles();
	return (
		<div>
			<ReactLoading
				className={classes.loadingAnimation}
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
