import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';

import {
	useTheme,
	makeStyles,
	MuiThemeProvider,
	createMuiTheme
} from '@material-ui/core/styles';

import {SnackbarProvider} from 'notistack';

import {CircularProgressbar, buildStyles} from 'react-circular-progressbar';
// eslint-disable-next-line import/no-unassigned-import
import 'react-circular-progressbar/dist/styles.css';

import CssBaseline from '@material-ui/core/CssBaseline';

import {sum, map} from '@aureooms/js-itertools';

import {settings} from '../api/settings.js';

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
	progressbarContainer: {
		position: 'relative',
		display: 'flex',
		width: '100%',
		minHeight: '100vh'
	},
	progressbar: {
		margin: 'auto',
		height: 100,
		width: 100,
		fontWeight: 'bold'
	}
}));

const App = (props) => {
	const {currentUser, textTransform, navigationDrawerIsOpen, progress} = props;

	const theme = useTheme();
	const classes = useStyles();

	return (
		<MuiThemeProvider theme={muitheme}>
			<CssBaseline />
			<SnackbarProvider>
				<ErrorBoundary>
					{progress < 1 ? (
						<div className={classes.progressbarContainer}>
							<CircularProgressbar
								background
								className={classes.progressbar}
								maxValue={1}
								value={progress}
								text={`${(100 * progress) | 0}%`}
								backgroundPadding={6}
								styles={buildStyles({
									backgroundColor: theme.palette.primary.main,
									textColor: '#fff',
									pathColor: '#fff',
									trailColor: 'transparent'
								})}
							/>
						</div>
					) : (
						<div>
							<CustomWholeWindowDropZone />
							<div className={classes.appFrame} style={{textTransform}}>
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
								/>
							</div>
						</div>
					)}
				</ErrorBoundary>
			</SnackbarProvider>
		</MuiThemeProvider>
	);
};

export default withTracker(() => {
	const handles = [
		{ready: () => true},
		settings.subscribe('text-transform'),
		settings.subscribe('navigation-drawer-is-open')
	];
	return {
		progress: sum(map((x) => (x.ready() ? 1 : 0), handles)) / handles.length,
		textTransform: settings.get('text-transform'),
		navigationDrawerIsOpen: settings.get('navigation-drawer-is-open'),
		currentUser: Meteor.user()
	};
})(App);
