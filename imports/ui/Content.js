import React from 'react' ;
import PropTypes from 'prop-types';

import useStyles from './styles/main.js';
import NoContent from './navigation/NoContent.js';
import Router from './Router.js';
import ErrorBoundary from './ErrorBoundary.js';

export default function Content ( { patients, currentUser, history } ) {

	const classes = useStyles();

	if (!currentUser) return (
		<main className={classes.main}>
			<NoContent>Please sign in</NoContent>
		</main>
	) ;

	return (
		<main className={classes.main}>
			<ErrorBoundary>
				<Router patients={patients} history={history}/>
			</ErrorBoundary>
		</main>
	);
}

Content.propTypes = {
	history: PropTypes.object.isRequired,
};
