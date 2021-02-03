import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import Sex from './Sex.js';
import Age from './Age.js';
import Frequency from './Frequency.js';

const useStyles = makeStyles(() => ({
	content: {
		textAlign: 'center'
	},
	chart: {
		position: 'relative',
		display: 'inline-block'
	}
}));

const Chart = ({title, subheader, children, ...rest}) => {
	const classes = useStyles();
	return (
		<Grid item {...rest}>
			<Card>
				<CardHeader title={title} subheader={subheader} />
				<CardContent className={classes.content}>
					<div className={classes.chart}>{children}</div>
				</CardContent>
			</Card>
		</Grid>
	);
};

const Stats = () => {
	return (
		<Grid container spacing={3}>
			<Chart
				title="Gender"
				subheader="Pie chart showing the proportion of gender accross all patients"
			>
				<Sex width={400} height={400} />
			</Chart>
			<Chart
				title="Age / Gender"
				subheader="Bar chart showing the distribution of age split by gender"
			>
				<Age width={640} height={400} />
			</Chart>
			<Chart
				title="Frequency / Gender"
				subheader="Bar chart showing the distribution of consultation frequency split by gender"
			>
				<Frequency width={640} height={400} />
			</Chart>
		</Grid>
	);
};

export default Stats;
