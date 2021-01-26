import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
	container: {
		marginTop: theme.spacing(3),
		textAlign: 'center'
	},
	paper: {
		whiteSpace: 'pre-wrap',
		padding: theme.spacing(3),
		display: 'inline-block'
	}
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
