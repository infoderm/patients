import {Meteor} from 'meteor/meteor';

import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';

import {useStyles} from './Popover.js';
import {useSnackbar} from 'notistack';

const LoginPopover = ({anchorEl, handleClose, changeMode}) => {
	const classes = useStyles();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorUsername, setErrorUsername] = useState('');
	const [errorPassword, setErrorPassword] = useState('');

	const login = (event) => {
		event.preventDefault();
		const key = enqueueSnackbar('Logging in...', {variant: 'info'});
		Meteor.loginWithPassword(username, password, (err) => {
			closeSnackbar(key);
			if (err) {
				const {message, reason} = err;
				enqueueSnackbar(message, {variant: 'error'});
				if (reason === 'User not found') {
					setErrorUsername(reason);
					setErrorPassword('');
				} else if (reason === 'Match failed') {
					setErrorUsername('Please enter a username');
					setErrorPassword('');
				} else if (reason === 'Incorrect password') {
					setErrorUsername('');
					setErrorPassword(reason);
				} else {
					setErrorUsername('');
					setErrorPassword('');
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
				horizontal: 'right'
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right'
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
					onChange={(e) => setUsername(e.target.value)}
				/>
				<TextField
					error={Boolean(errorPassword)}
					helperText={errorPassword}
					className={classes.row}
					label="Password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Button
					type="submit"
					color="primary"
					className={classes.row}
					onClick={login}
				>
					Log in
				</Button>
				<Button
					color="secondary"
					className={classes.row}
					onClick={() => changeMode('register')}
				>
					Create account?
				</Button>
			</form>
		</Popover>
	);
};

LoginPopover.propTypes = {
	anchorEl: PropTypes.object,
	handleClose: PropTypes.func.isRequired,
	changeMode: PropTypes.func.isRequired
};

export default LoginPopover;
