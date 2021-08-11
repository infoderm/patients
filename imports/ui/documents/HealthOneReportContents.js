import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
	container: {
		maxWidth: 1200,
		margin: '0 auto',
		marginTop: theme.spacing(3),
		textAlign: 'center',
	},
	paper: {
		display: 'inline-block',
		whiteSpace: 'pre-wrap',
		padding: theme.spacing(3),
	},
}));

const HealthOneReportContents = ({document}) => {
	const classes = useStyles();

	return (
		<div className={classes.container}>
			<Paper className={classes.paper}>{document.text.join('\n').trim()}</Paper>
		</div>
	);
};

export default HealthOneReportContents;
