import React from 'react';

import useStyles from './styles/main';
import NoContent from './navigation/NoContent';
import Router from './Router';
import ErrorBoundary from './ErrorBoundary';

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
