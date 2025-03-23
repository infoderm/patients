import React, {useDeferredValue} from 'react';
import {styled} from '@mui/material/styles';
import {useParams} from 'react-router-dom';

import Typography from '@mui/material/Typography';

import {myDecodeURIComponent} from '../../util/uri';

import useRandom from '../hooks/useRandom';
import PatientsObservedSearchResultsPager from '../patients/PatientsObservedSearchResultsPager';

const PREFIX = 'FullTextSearchResults';

const classes = {
	root: `${PREFIX}-root`,
	heading: `${PREFIX}-heading`,
	results: `${PREFIX}-results`,
};

const Root = styled('div')({
	[`&.${classes.root}`]: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},

	[`& .${classes.heading}`]: {
		display: 'inline',
	},

	[`& .${classes.results}`]: {
		padding: '1em 0',
	},
});

type Params = {
	query: string;
};

const FullTextSearchResults = () => {
	const [key, refresh] = useRandom();
	const {query: rawQuery} = useParams<Params>();
	const query = myDecodeURIComponent(rawQuery);
	const deferredQuery = useDeferredValue(query ?? '');
	return (
		<Root className={classes.root}>
			<Typography className={classes.heading} variant="h3">
				Results for query `{deferredQuery}`.
			</Typography>
			<PatientsObservedSearchResultsPager
				className={classes.results}
				query={deferredQuery}
				refresh={refresh}
				refreshKey={key}
			/>
		</Root>
	);
};

export default FullTextSearchResults;
