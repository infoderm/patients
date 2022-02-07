import React from 'react';
import {useParams} from 'react-router-dom';

import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';

import {myDecodeURIComponent} from '../../util/uri';

import useRandom from '../hooks/useRandom';
import PatientsObservedSearchResultsPager from '../patients/PatientsObservedSearchResultsPager';

const useStyles = makeStyles(() => ({
	root: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	heading: {
		display: 'inline',
	},
	results: {
		padding: '1em 0',
	},
}));

type Params = {
	query: string;
};

const FullTextSearchResults = () => {
	const classes = useStyles();
	const [key, refresh] = useRandom();
	const {query: rawQuery} = useParams<Params>();
	const query = myDecodeURIComponent(rawQuery);
	return (
		<div className={classes.root}>
			<Typography className={classes.heading} variant="h3">
				Results for query `{query}`.
			</Typography>
			<PatientsObservedSearchResultsPager
				className={classes.results}
				query={query}
				refresh={refresh}
				refreshKey={key}
			/>
		</div>
	);
};

export default FullTextSearchResults;
