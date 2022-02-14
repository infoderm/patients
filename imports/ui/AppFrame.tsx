import React from 'react';

import {styled} from '@mui/material/styles';

import LinearProgress from '@mui/material/LinearProgress';

import {useSettingCached} from './settings/hooks';

import Header from './Header';
import Content from './Content';
import NavigationDrawer from './NavigationDrawer';

import useLoggingIn from './users/useLoggingIn';
import useLoggingOut from './users/useLoggingOut';
import useUser from './users/useUser';
import useStatusNotifications from './users/useStatusNotifications';

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

const useUISettings = () => {
	const {loading: loadingTextTransform, value: textTransform} =
		useSettingCached('text-transform');
	const {
		loading: loadingNavigationDrawerIsOpen,
		value: navigationDrawerIsOpen,
	} = useSettingCached('navigation-drawer-is-open');
	const loading = loadingTextTransform || loadingNavigationDrawerIsOpen;
	return {
		loading,
		textTransform,
		navigationDrawerIsOpen,
	};
};

const AppFrame = () => {
	useStatusNotifications();
	const loggingIn = useLoggingIn();
	const loggingOut = useLoggingOut();
	const currentUser = useUser();
	const {loading, textTransform, navigationDrawerIsOpen} = useUISettings();

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
