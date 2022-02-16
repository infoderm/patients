import {Meteor} from 'meteor/meteor';

import React, {useState} from 'react';

import LinearProgress from '@mui/material/LinearProgress';

import {useSnackbar} from 'notistack';
import loginWithPassword from '../../api/user/loginWithPassword';

import debounceSnackbar from '../../util/debounceSnackbar';
import {Popover, Form, RowTextField, RowButton} from './Popover';

interface Props {
	anchorEl: HTMLElement;
	handleClose: () => void;
	changeMode: (mode: string) => void;
}

const LoginPopover = ({anchorEl, handleClose, changeMode}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorUsername, setErrorUsername] = useState('');
	const [errorPassword, setErrorPassword] = useState('');
	const [loggingIn, setLoggingIn] = useState(false);

	const login = async (event) => {
		event.preventDefault();
		setLoggingIn(true);
		const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
		feedback('Logging in...', {
			variant: 'info',
			persist: true,
		});
		return loginWithPassword(username, password).then(
			() => {
				setLoggingIn(false);
				feedback('Welcome back!', {variant: 'success'});
			},
			(error) => {
				setLoggingIn(false);
				const message =
					error instanceof Error ? error.message : 'unknown error';
				feedback(message, {variant: 'error'});
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
			<Form autoComplete="off">
				<RowTextField
					autoFocus
					id="login-popover-input-username"
					error={Boolean(errorUsername)}
					helperText={errorUsername}
					label="Username"
					value={username}
					disabled={loggingIn}
					onChange={(e) => {
						setUsername(e.target.value);
					}}
				/>
				<RowTextField
					id="login-popover-input-password"
					error={Boolean(errorPassword)}
					helperText={errorPassword}
					label="Password"
					type="password"
					value={password}
					disabled={loggingIn}
					onChange={(e) => {
						setPassword(e.target.value);
					}}
				/>
				<RowButton
					type="submit"
					color="primary"
					disabled={loggingIn}
					onClick={login}
				>
					Log in
				</RowButton>
				<RowButton
					color="secondary"
					disabled={loggingIn}
					onClick={() => {
						changeMode('register');
					}}
				>
					Create account?
				</RowButton>
			</Form>
			{loggingIn && <LinearProgress />}
		</Popover>
	);
};

export default LoginPopover;
