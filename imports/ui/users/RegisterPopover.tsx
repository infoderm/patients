import {Meteor} from 'meteor/meteor';

import React, {useState} from 'react';

import {useSnackbar} from 'notistack';

import createUserWithPasswordAndLogin from '../../api/user/createUserWithPasswordAndLogin';

import debounceSnackbar from '../snackbar/debounceSnackbar';

import {Popover, Form, RowTextField, RowButton} from './Popover';

type Props = {
	readonly id: string;
	readonly anchorEl: HTMLElement;
	readonly open: boolean;
	readonly handleClose: () => void;
	readonly changeMode: (mode: 'choice' | 'login' | 'register') => void;
};

const RegisterPopover = ({
	id,
	anchorEl,
	open,
	handleClose,
	changeMode,
}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorUsername, setErrorUsername] = useState('');
	const [errorPassword, setErrorPassword] = useState('');

	const register = async (event: {preventDefault: () => void}) => {
		event.preventDefault();
		const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
		feedback('Creating account...', {
			variant: 'info',
			persist: true,
		});
		return createUserWithPasswordAndLogin(username, password).then(
			() => {
				feedback('Welcome!', {variant: 'success'});
			},
			(error) => {
				const message =
					error instanceof Error ? error.message : 'unknown error';
				feedback(message, {variant: 'error'});
				const reason = error instanceof Meteor.Error ? error.reason : undefined;
				switch (reason) {
					case 'Need to set a username or email': {
						setErrorUsername('Please enter a username');
						setErrorPassword('');

						break;
					}

					case 'Username already exists.': {
						setErrorUsername(reason);
						setErrorPassword('');

						break;
					}

					case 'Password may not be empty': {
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
			id={id}
			anchorEl={anchorEl}
			open={open}
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
					id="register-popover-input-username"
					error={Boolean(errorUsername)}
					helperText={errorUsername}
					label="Username"
					value={username}
					onChange={(e) => {
						setUsername(e.target.value);
					}}
				/>
				<RowTextField
					id="register-popover-input-password"
					error={Boolean(errorPassword)}
					helperText={errorPassword}
					label="Password"
					type="password"
					value={password}
					onChange={(e) => {
						setPassword(e.target.value);
					}}
				/>
				<RowButton type="submit" color="primary" onClick={register}>
					Register
				</RowButton>
				<RowButton
					color="secondary"
					onClick={() => {
						changeMode('login');
					}}
				>
					Already registered?
				</RowButton>
			</Form>
		</Popover>
	);
};

export default RegisterPopover;
