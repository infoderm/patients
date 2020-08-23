import React, {useState} from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import {myDecodeURIComponent} from '../../client/uri.js';

import PatientsObservedSearchResults from '../patients/PatientsObservedSearchResults.js';

const useStyles = makeStyles(() => ({
	results: {
		padding: '1em 0'
	}
}));

export default function FullTextSearchResults({match}) {
	const classes = useStyles();
	const [key, setKey] = useState(Math.random());
	const refresh = () => setKey(Math.random());
	const query = myDecodeURIComponent(match.params.query);
	return (
		<div>
			<Typography variant="h3">Results for query `{query}`.</Typography>
			<PatientsObservedSearchResults
				className={classes.results}
				match={match}
				refresh={refresh}
				refreshKey={key}
			/>
		</div>
	);
}
