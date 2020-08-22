import React from 'react';

import {makeStyles} from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import RefreshIcon from '@material-ui/icons/Refresh';

const useStyles = makeStyles((theme) => ({
	fabrefresh: {
		position: 'fixed',
		bottom: theme.spacing(3),
		right: theme.spacing(3)
	}
}));

export default function Refresh(props) {
	const classes = useStyles();

	return (
		<Fab className={classes.fabrefresh} {...props}>
			<RefreshIcon />
		</Fab>
	);
}
