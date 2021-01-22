import React from 'react';

import useStyles from './styles/main.js';
import NoContent from './navigation/NoContent.js';
import Router from './Router.js';
import ErrorBoundary from './ErrorBoundary.js';

const Child = ({loading, loggingIn, currentUser}) => {
	if (loading) return <NoContent>Loading...</NoContent>;
	if (loggingIn) return <NoContent>Logging in...</NoContent>;
	if (!currentUser) return <NoContent>Please sign in</NoContent>;

	return (
		<ErrorBoundary>
			<Router />
		</ErrorBoundary>
	);
};

const Content = (props) => {
	const classes = useStyles();

	return (
		<main className={classes.main}>
			<Child {...props} />
		</main>
	);
};

export default Content;
