import React from 'react';

import useStyles from './styles/main.js';
import NoContent from './navigation/NoContent.js';
import Router from './Router.js';
import ErrorBoundary from './ErrorBoundary.js';

export default function Content({loading, currentUser}) {
	const classes = useStyles();

	if (!currentUser) {
		return (
			<main className={classes.main}>
				{loading ? (
					<NoContent>Loading...</NoContent>
				) : (
					<NoContent>Please sign in</NoContent>
				)}
			</main>
		);
	}

	return (
		<main className={classes.main}>
			<ErrorBoundary>
				<Router />
			</ErrorBoundary>
		</main>
	);
}
