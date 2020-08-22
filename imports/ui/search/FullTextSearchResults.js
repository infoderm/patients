import React, {useState} from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import {myDecodeURIComponent} from '../../client/uri.js';

import Refresh from '../navigation/Refresh.js';
import PatientsSearchResults from '../patients/PatientsSearchResults.js';

const useStyles = makeStyles(() => ({
	results: {
		padding: '1em 0'
	}
}));

export default function FullTextSearchResults({match}) {
	const classes = useStyles();
	const [key, setKey] = useState(Math.random());
	const query = myDecodeURIComponent(match.params.query);
	return (
		<div key={key}>
			<Typography variant="h3">Results for query `{query}`.</Typography>
			<PatientsSearchResults className={classes.results} match={match} />
			<Refresh onClick={() => setKey(Math.random())} />
		</div>
	);
}
