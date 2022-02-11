import React from 'react';

import {useTracker} from 'meteor/react-meteor-data';

import {styled} from '@mui/material/styles';

import LinearProgress from '@mui/material/LinearProgress';

import {all} from '@iterable-iterator/reduce';
import {map} from '@iterable-iterator/map';

import {settings} from './settings/hooks';

import Header from './Header';
import Content from './Content';
import NavigationDrawer from './NavigationDrawer';

import useLoggingIn from './users/useLoggingIn';
import useLoggingOut from './users/useLoggingOut';
import useUser from './users/useUser';

const Progress = styled(LinearProgress)({
	display: 'block',
	position: 'fixed',
	width: '100%',
	zIndex: 9999,
});

const Frame = styled('div')({
	position: 'relative',
	display: 'flex',
	width: '100%',
	minHeight: '100vh',
});

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
	const {loading, textTransform, navigationDrawerIsOpen} = useUISettings();
	const loggingIn = useLoggingIn();
	const loggingOut = useLoggingOut();
	const currentUser = useUser();

	return (
		<Frame style={{textTransform}}>
			{loading && <Progress />}
			<Header
				navigationDrawerIsOpen={navigationDrawerIsOpen}
				currentUser={currentUser}
			/>
			<NavigationDrawer
				navigationDrawerIsOpen={navigationDrawerIsOpen}
				currentUser={currentUser}
			/>
			<Content
				loggingIn={loggingIn}
				loggingOut={loggingOut}
				currentUser={currentUser}
				loading={loading}
			/>
		</Frame>
	);
};

export default AppFrame;
