import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Sex from './Sex.js';
import Age from './Age.js';
// import Frequency from './Frequency.js';

const useStyles = makeStyles((theme) => ({
	chart: {
		position: 'relative',
		margin: theme.spacing(5)
	}
}));

const Stats = () => {
	const classes = useStyles();
	return (
		<div>
			<Typography variant="h3">Gender</Typography>
			<Sex className={classes.chart} width={400} height={400} />
			<Typography variant="h3">Age / Gender</Typography>
			<Age className={classes.chart} width={800} height={500} />
		</div>
	);
};

export default Stats;

// <Typography variant="h3">Frequency vs Gender</Typography>
// <Frequency className={classes.chart} width={800} height={500} />
