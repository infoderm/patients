import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
	empty: {
		textAlign: 'center',
		margin: '3em 0',
		color: '#999'
	}
}));

const NoContent = ({children, ...props}) => {
	const classes = useStyles();
	return (
		<Typography className={classes.empty} variant="h3" {...props}>
			{children}
		</Typography>
	);
};

export default NoContent;
