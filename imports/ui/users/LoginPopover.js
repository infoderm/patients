import {Meteor} from 'meteor/meteor';

import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';
import LinearProgress from '@material-ui/core/LinearProgress';

import {useSnackbar} from 'notistack';
import {useStyles} from './Popover';

const LoginPopover = ({anchorEl, handleClose, changeMode}) => {
	const classes = useStyles();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorUsername, setErrorUsername] = useState('');
	const [errorPassword, setErrorPassword] = useState('');
	const [loggingIn, setLoggingIn] = useState(false);

	const login = (event) => {
		event.preventDefault();
		setLoggingIn(true);
		const key = enqueueSnackbar('Logging in...', {
			variant: 'info',
			persist: true,
		});
		Meteor.loginWithPassword(username, password, (err) => {
			setLoggingIn(false);
			closeSnackbar(key);
			if (err) {
				const {message} = err;
				enqueueSnackbar(message, {variant: 'error'});
				const reason = err instanceof Meteor.Error ? err.reason : undefined;
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
			} else {
				enqueueSnackbar('Welcome back!', {variant: 'success'});
			}
		});
	};

	return (
		<Popover
			className={classes.popover}
			id="dashboard-change-password"
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
					error={Boolean(errorUsername)}
					helperText={errorUsername}
					className={classes.row}
					label="Username"
					value={username}
					disabled={loggingIn}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<TextField
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
