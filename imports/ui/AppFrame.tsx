import React from 'react';

import {useTracker} from 'meteor/react-meteor-data';

import {makeStyles} from '@material-ui/core/styles';

import LinearProgress from '@material-ui/core/LinearProgress';

import {all} from '@iterable-iterator/reduce';
import {map} from '@iterable-iterator/map';

import {settings} from './settings/hooks';

import Header from './Header';
import Content from './Content';
import NavigationDrawer from './NavigationDrawer';

import useLoggingIn from './users/useLoggingIn';
import useUser from './users/useUser';

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

const AppFrame = () => {
	const classes = useStyles();
	const {loading, textTransform, navigationDrawerIsOpen} = useUISettings();
	const loggingIn = useLoggingIn();
	const currentUser = useUser();

	return (
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
	);
};

export default AppFrame;
