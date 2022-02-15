import React from 'react';

import OfflineIcon from '@mui/icons-material/SignalWifiOff';
import WaitingIcon from '@mui/icons-material/HourglassTop';
import ConnectingIcon from '@mui/material/CircularProgress';
import ConnectedIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import FailedIcon from '@mui/icons-material/Error';

import {SnackbarOrigin, SnackbarProvider} from 'notistack';
import useStatusNotifications from './users/useStatusNotifications';

const anchorOrigin: SnackbarOrigin = {
	horizontal: 'center',
	vertical: 'bottom',
};

const iconStyles = {
	fontSize: 20,
	marginInlineEnd: 8,
};

const iconVariant = {
	default: <ConnectingIcon size={20} color="inherit" style={iconStyles} />,
	success: <ConnectedIcon style={iconStyles} />,
	info: <OfflineIcon style={iconStyles} />,
	warning: <WaitingIcon style={iconStyles} />,
	error: <FailedIcon style={iconStyles} />,
};

const Notifications = () => {
	useStatusNotifications();
	return null;
};

const StatusNotifications = () => {
	return (
		<SnackbarProvider
			maxSnack={1}
			autoHideDuration={3000}
			iconVariant={iconVariant}
			anchorOrigin={anchorOrigin}
		>
			<Notifications />
		</SnackbarProvider>
	);
};

export default StatusNotifications;
