import {Meteor} from 'meteor/meteor';

import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Popover from '@mui/material/Popover';
import LinearProgress from '@mui/material/LinearProgress';

import {useSnackbar} from 'notistack';
import loginWithPassword from '../../api/user/loginWithPassword';

import {useStyles} from './Popover';

const LoginPopover = ({anchorEl, handleClose, changeMode}) => {
	const classes = useStyles();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorUsername, setErrorUsername] = useState('');
	const [errorPassword, setErrorPassword] = useState('');
	const [loggingIn, setLoggingIn] = useState(false);

	const login = async (event) => {
		event.preventDefault();
		setLoggingIn(true);
		const key = enqueueSnackbar('Logging in...', {
			variant: 'info',
			persist: true,
		});
		return loginWithPassword(username, password).then(
			() => {
				setLoggingIn(false);
				closeSnackbar(key);
				enqueueSnackbar('Welcome back!', {variant: 'success'});
			},
			(error) => {
				setLoggingIn(false);
				closeSnackbar(key);
				const message =
					error instanceof Error ? error.message : 'unknown error';
				enqueueSnackbar(message, {variant: 'error'});
				const reason = error instanceof Meteor.Error ? error.reason : undefined;
				switch (reason) {
					case 'User not found': {
						setErrorUsername(reason);
						setErrorPassword('');

						break;
					}

					case 'Match failed': {
						setErrorUsername('Please enter a username');
						setErrorPassword('');

						break;
					}

					case 'Incorrect password': {
						setErrorUsername('');
						setErrorPassword(reason);

						break;
					}

					default: {
						setErrorUsername('');
						setErrorPassword('');
					}
				}
			},
		);
	};

	return (
		<Popover
			className={classes.popover}
			id="login-popover"
			anchorEl={anchorEl}
			open={Boolean(anchorEl)}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			onClose={handleClose}
		>
			<form className={classes.form} autoComplete="off">
				<TextField
					autoFocus
					id="login-popover-input-username"
					error={Boolean(errorUsername)}
					helperText={errorUsername}
					className={classes.row}
					label="Username"
					value={username}
					disabled={loggingIn}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<TextField
					id="login-popover-input-password"
					error={Boolean(errorPassword)}
					helperText={errorPassword}
					className={classes.row}
					label="Password"
					type="password"
					value={password}
					disabled={loggingIn}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Button
					type="submit"
					color="primary"
					className={classes.row}
					disabled={loggingIn}
					onClick={login}
				>
					Log in
				</Button>
				<Button
					color="secondary"
					className={classes.row}
					disabled={loggingIn}
					onClick={() => changeMode('register')}
				>
					Create account?
				</Button>
			</form>
			{loggingIn && <LinearProgress />}
		</Popover>
	);
};

LoginPopover.propTypes = {
	anchorEl: PropTypes.object,
	handleClose: PropTypes.func.isRequired,
	changeMode: PropTypes.func.isRequired,
};

export default LoginPopover;
