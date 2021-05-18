import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import {myDecodeURIComponent} from '../../client/uri.js';

import useRandom from '../hooks/useRandom.js';
import PatientsObservedSearchResults from '../patients/PatientsObservedSearchResults.js';

const useStyles = makeStyles(() => ({
	root: {
		overflow: 'hidden',
		textOverflow: 'ellipsis'
	},
	heading: {
		display: 'inline'
	},
	results: {
		padding: '1em 0'
	}
}));

export default function FullTextSearchResults({match}) {
	const classes = useStyles();
	const [key, refresh] = useRandom();
	const query = myDecodeURIComponent(match.params.query);
	return (
		<div className={classes.root}>
			<Typography className={classes.heading} variant="h3">
				Results for query `{query}`.
			</Typography>
			<PatientsObservedSearchResults
				className={classes.results}
				match={match}
				refresh={refresh}
				refreshKey={key}
			/>
		</div>
	);
}
