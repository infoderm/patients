import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';

import {
	makeStyles,
	MuiThemeProvider,
	createMuiTheme
} from '@material-ui/core/styles';

import {SnackbarProvider} from 'notistack';

import LinearProgress from '@material-ui/core/LinearProgress';

import CssBaseline from '@material-ui/core/CssBaseline';

import {all, map} from '@aureooms/js-itertools';

import {settings} from '../client/settings.js';

import CustomWholeWindowDropZone from './input/CustomWholeWindowDropZone.js';
import Header from './Header.js';
import Content from './Content.js';
import NavigationDrawer from './NavigationDrawer.js';
import ErrorBoundary from './ErrorBoundary.js';

const muitheme = createMuiTheme({
	typography: {
		useNextVariants: true
	}
});

const useStyles = makeStyles(() => ({
	appFrame: {
		position: 'relative',
		display: 'flex',
		width: '100%',
		minHeight: '100vh'
	},
	progress: {
		display: 'block',
		position: 'fixed',
		width: '100%',
		zIndex: 9999
	}
}));

const App = (props) => {
	const {currentUser, textTransform, navigationDrawerIsOpen, loading} = props;

	const classes = useStyles();

	return (
		<MuiThemeProvider theme={muitheme}>
			<CssBaseline />
			<SnackbarProvider maxSnack={10} autoHideDuration={8000}>
				<ErrorBoundary>
					<div>
						<CustomWholeWindowDropZone />
						<div className={classes.appFrame} style={{textTransform}}>
							{loading && <LinearProgress className={classes.progress} />}
							<Header
								navigationDrawerIsOpen={navigationDrawerIsOpen}
								currentUser={currentUser}
							/>
							<NavigationDrawer
								navigationDrawerIsOpen={navigationDrawerIsOpen}
								currentUser={currentUser}
							/>
							<Content
								navigationDrawerIsOpen={navigationDrawerIsOpen}
								currentUser={currentUser}
								loading={loading}
							/>
						</div>
					</div>
				</ErrorBoundary>
			</SnackbarProvider>
		</MuiThemeProvider>
	);
};

export default withTracker(() => {
	const handles = [
		settings.subscribe('text-transform'),
		settings.subscribe('navigation-drawer-is-open')
	];
	return {
		loading: !all(map((x) => x.ready(), handles)),
		textTransform: settings.getWithBrowserCache('text-transform'),
		navigationDrawerIsOpen: settings.getWithBrowserCache(
			'navigation-drawer-is-open'
		),
		currentUser: Meteor.user()
	};
})(App);
