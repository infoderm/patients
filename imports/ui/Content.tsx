import React from 'react';

import NoContent from './navigation/NoContent';
import Router from './Router';
import ErrorBoundary from './ErrorBoundary';
import Main from './Main';

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

const Content = (props) => (
	<Main>
		<Child {...props} />
	</Main>
);

export default Content;
