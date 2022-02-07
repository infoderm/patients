import React from 'react';

import makeStyles from '@mui/styles/makeStyles';
import Paper from '@mui/material/Paper';

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
