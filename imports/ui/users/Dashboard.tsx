import React, {useCallback, useEffect, useRef, useState} from 'react';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import {useSnackbar} from 'notistack';

import logout from '../../api/user/logout';

import reconnect from '../../api/connection/reconnect';
import disconnect from '../../api/connection/disconnect';
import debounceSnackbar from '../snackbar/debounceSnackbar';
import useUniqueId from '../hooks/useUniqueId';

import ChangePasswordPopover from './ChangePasswordPopover';
import useStatus from './useStatus';

const Logout = () => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const uiLogout = useCallback(async () => {
		const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
		feedback('Logging out...', {
			variant: 'info',
			persist: true,
		});
		return logout().then(
			() => {
				feedback('See you soon!', {variant: 'success'});
			},
			(error) => {
				const message =
					error instanceof Error ? error.message : 'unknown error';
				feedback(message, {variant: 'error'});
			},
		);
	}, [enqueueSnackbar, closeSnackbar]);

	return <MenuItem onClick={uiLogout}>Logout</MenuItem>;
};

type OfflineOnlineToggleProps = {
	readonly onSuccess: () => void;
};

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
		case 'connected': {
			return <MenuItem onClick={offline}>Work offline</MenuItem>;
		}

		case 'offline': {
			return <MenuItem onClick={online}>Work online</MenuItem>;
		}

		default: {
			return <MenuItem disabled>Work offline</MenuItem>;
		}
	}
};

type Mode = 'choice' | 'options' | 'change-password';

type OptionsPopoverProps = {
	readonly id: string;
	readonly anchorEl: HTMLElement;
	readonly open: boolean;
	readonly handleClose: () => void;
	readonly changeMode: (mode: Mode) => void;
};

const OptionsPopover = ({
	id,
	anchorEl,
	open,
	handleClose,
	changeMode,
}: OptionsPopoverProps) => {
	const handleModeChangePassword = () => {
		changeMode('change-password');
	};

	return (
		<Menu
			id={id}
			anchorEl={anchorEl}
			open={open}
			onClose={handleClose}
		>
			<MenuItem onClick={handleModeChangePassword}>Change password</MenuItem>
			<Logout />
			<OfflineOnlineToggle onSuccess={handleClose} />
		</Menu>
	);
};

const Dashboard = ({currentUser}) => {
	const anchorRef = useRef(null);
	const anchorEl = anchorRef.current;
	const [mode, setMode] = useState<Mode>('choice');

	const handleClick = () => {
		setMode('options');
	};

	const changeMode = (newMode: Mode) => {
		setMode(newMode);
	};

	const handleClose = () => {
		setMode('choice');
	};

	const dashboardId = useUniqueId('dashboard');
	const optionsPopoverId = `${dashboardId}-options`;
	const changePasswordPopoverId = `${dashboardId}-changePassword`;

	return (
		<div>
			<Button
				ref={anchorRef}
				aria-controls={
					anchorEl
						? mode === 'options'
							? 'dashboard-options'
							: 'dashboard-change-password'
						: undefined
				}
				aria-haspopup="true"
				aria-expanded={anchorEl === null ? undefined : 'true'}
				style={{color: 'inherit'}}
				endIcon={<AccountCircleIcon />}
				onClick={handleClick}
			>
				Logged in as {currentUser.username}
			</Button>
			{anchorEl !== null && (
				<OptionsPopover
				id={optionsPopoverId}
				anchorEl={anchorEl}
				open={mode === 'options'}
				changeMode={changeMode}
				handleClose={handleClose}
			/>)}
			{anchorEl !== null && mode === 'change-password' && (
				<ChangePasswordPopover
				id={changePasswordPopoverId}
				anchorEl={anchorEl}
				open={true}
				handleClose={handleClose}
			/>)}
		</div>
	);
};

export default Dashboard;
