import React from 'react';

import {useTracker} from 'meteor/react-meteor-data';

import {
	makeStyles,
	MuiThemeProvider,
	createMuiTheme,
	responsiveFontSizes,
} from '@material-ui/core/styles';

import {SnackbarProvider} from 'notistack';

import LinearProgress from '@material-ui/core/LinearProgress';

import CssBaseline from '@material-ui/core/CssBaseline';

import {LocalizationProvider} from '@material-ui/pickers';
import AdapterDateFns from '@material-ui/pickers/adapter/date-fns';

import {all} from '@iterable-iterator/reduce';
import {map} from '@iterable-iterator/map';

import {settings} from '../client/settings';

import {useLocale} from '../i18n/datetime';

import CustomWholeWindowDropZone from './input/CustomWholeWindowDropZone';
import Header from './Header';
import Content from './Content';
import NavigationDrawer from './NavigationDrawer';
import ErrorBoundary from './ErrorBoundary';

import useLoggingIn from './users/useLoggingIn';
import useUser from './users/useUser';

let muitheme = createMuiTheme();
muitheme = responsiveFontSizes(muitheme);

const useStyles = makeStyles(() => ({
	appFrame: {
		position: 'relative',
		display: 'flex',
		width: '100%',
		minHeight: '100vh',
	},
	progress: {
		display: 'block',
		position: 'fixed',
		width: '100%',
		zIndex: 9999,
	},
}));

const useUISettings = () =>
	useTracker(() => {
		const handles = [
			settings.subscribe('text-transform'),
			settings.subscribe('navigation-drawer-is-open'),
		];
		return {
			loading: !all(map((x) => x.ready(), handles)),
			textTransform: settings.getWithBrowserCache('text-transform'),
			navigationDrawerIsOpen: settings.getWithBrowserCache(
				'navigation-drawer-is-open',
			),
		};
	}, []);

const App = () => {
	const classes = useStyles();
	const {loading, textTransform, navigationDrawerIsOpen} = useUISettings();
	const loggingIn = useLoggingIn();
	const currentUser = useUser();
	const locale = useLocale();

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns} locale={locale}>
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
									loggingIn={loggingIn}
									currentUser={currentUser}
									loading={loading}
								/>
							</div>
						</div>
					</ErrorBoundary>
				</SnackbarProvider>
			</MuiThemeProvider>
		</LocalizationProvider>
	);
};

export default App;
