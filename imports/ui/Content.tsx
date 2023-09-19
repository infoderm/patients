import React from 'react';

import NoContent from './navigation/NoContent';
import Router from './Router';
import ErrorBoundary from './ErrorBoundary';
import Main from './Main';

type Props = {
	readonly loading: boolean;
	readonly loggingIn: boolean;
	readonly loggingOut: boolean;
	readonly currentUser: any;
};

const Child = ({loading, loggingIn, loggingOut, currentUser}: Props) => {
	if (loading) return <NoContent>Loading...</NoContent>;
	if (loggingIn) return <NoContent>Logging in...</NoContent>;
	if (loggingOut) return <NoContent>Logging out...</NoContent>;
	if (!currentUser) return <NoContent>Please sign in</NoContent>;

	return (
		<ErrorBoundary>
			<Router />
		</ErrorBoundary>
	);
};

const Content = (props: Props) => (
	<Main>
		<Child {...props} />
	</Main>
);

export default Content;
