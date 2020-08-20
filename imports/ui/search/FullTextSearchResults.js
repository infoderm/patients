import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import {myDecodeURIComponent} from '../../client/uri.js';

import PatientsSearchResults from '../patients/PatientsSearchResults.js';

const useStyles = makeStyles(() => ({
	results: {
		padding: '1em 0'
	}
}));

export default function FullTextSearchResults({match}) {
	const classes = useStyles();
	const query = myDecodeURIComponent(match.params.query);
	return (
		<div>
			<Typography variant="h3">Results for query `{query}`.</Typography>
			<PatientsSearchResults className={classes.results} match={match} />
		</div>
	);
}
