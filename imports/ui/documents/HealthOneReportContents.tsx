import React from 'react';

import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const PREFIX = 'HealthOneReportContents';

const classes = {
	container: `${PREFIX}-container`,
	paper: `${PREFIX}-paper`,
};

const Root = styled('div')(({theme}) => ({
	[`&.${classes.container}`]: {
		maxWidth: 1200,
		margin: '0 auto',
		marginTop: theme.spacing(3),
		textAlign: 'center',
	},

	[`& .${classes.paper}`]: {
		display: 'inline-block',
		whiteSpace: 'pre-wrap',
		padding: theme.spacing(3),
	},
}));

const HealthOneReportContents = ({document}) => {
	return (
		<Root className={classes.container}>
			<Paper className={classes.paper}>{document.text.join('\n').trim()}</Paper>
		</Root>
	);
};

export default HealthOneReportContents;
