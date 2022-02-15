import React, {useCallback, useEffect, useState} from 'react';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import {useSnackbar} from 'notistack';

import logout from '../../api/user/logout';

import reconnect from '../../api/connection/reconnect';
import disconnect from '../../api/connection/disconnect';
import ChangePasswordPopover from './ChangePasswordPopover';
import useStatus from './useStatus';

const Logout = () => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const uiLogout = useCallback(async () => {
		const key = enqueueSnackbar('Logging out...', {
			variant: 'info',
			persist: true,
		});
		return logout().then(
			() => {
				closeSnackbar(key);
				enqueueSnackbar('See you soon!', {variant: 'success'});
			},
			(error) => {
				closeSnackbar(key);
				const message =
					error instanceof Error ? error.message : 'unknown error';
				enqueueSnackbar(message, {variant: 'error'});
			},
		);
	}, [enqueueSnackbar, closeSnackbar]);

	return <MenuItem onClick={uiLogout}>Logout</MenuItem>;
};

interface OfflineOnlineToggleProps {
	onSuccess: () => void;
}

const OfflineOnlineToggle = ({onSuccess}: OfflineOnlineToggleProps) => {
	const {status} = useStatus();
	const [previous, setPrevious] = useState(0);

	const online = useCallback(() => {
		setPrevious(-1);
		reconnect();
	}, [setPrevious]);

	const offline = useCallback(() => {
		setPrevious(1);
		disconnect();
	}, [setPrevious]);

	useEffect(() => {
		if (
			(previous === -1 && status === 'connected') ||
			(previous === 1 && status === 'offline')
		) {
			setPrevious(0);
			onSuccess();
		}
	}, [status]);

	switch (status) {
		case 'connected':
			return <MenuItem onClick={offline}>Work offline</MenuItem>;
		case 'offline':
			return <MenuItem onClick={online}>Work online</MenuItem>;
		default:
			return <MenuItem disabled>Work offline</MenuItem>;
	}
};

const OptionsPopover = ({anchorEl, handleClose, changeMode}) => {
	const handleModeChangePassword = () => {
		changeMode('change-password');
	};

	return (
		<Menu
			id="dashboard-options"
			anchorEl={anchorEl}
			open={Boolean(anchorEl)}
			onClose={handleClose}
		>
			<MenuItem onClick={handleModeChangePassword}>Change password</MenuItem>
			<Logout />
			<OfflineOnlineToggle onSuccess={handleClose} />
		</Menu>
	);
};

const Dashboard = ({currentUser}) => {
	const [mode, setMode] = useState('options');
	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = (event) => {
		setMode('options');
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const changeMode = (newMode) => {
		setMode(newMode);
	};

	return (
		<div>
			<Button
				aria-owns={
					anchorEl
						? mode === 'options'
							? 'dashboard-options'
							: 'dashboard-change-password'
						: null
				}
				aria-haspopup="true"
				style={{color: 'inherit'}}
				endIcon={<AccountCircleIcon />}
				onClick={handleClick}
			>
				Logged in as {currentUser.username}
			</Button>
			{mode === 'options' ? (
				<OptionsPopover
					anchorEl={anchorEl}
					handleClose={handleClose}
					changeMode={changeMode}
				/>
			) : (
				<ChangePasswordPopover anchorEl={anchorEl} handleClose={handleClose} />
			)}
		</div>
	);
};

export default Dashboard;
