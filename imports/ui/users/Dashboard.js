import {Meteor} from 'meteor/meteor';

import React, {useState} from 'react';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import {useSnackbar} from 'notistack';

import ChangePasswordPopover from './ChangePasswordPopover';

const Logout = () => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const logout = () => {
		const key = enqueueSnackbar('Logging out...', {
			variant: 'info',
			persist: true
		});
		Meteor.logout((err) => {
			closeSnackbar(key);
			if (err) {
				enqueueSnackbar(err.message, {variant: 'error'});
			} else {
				enqueueSnackbar('See you soon!', {variant: 'success'});
			}
		});
	};

	return <MenuItem onClick={logout}>Logout</MenuItem>;
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
