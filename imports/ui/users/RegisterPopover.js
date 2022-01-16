import {Meteor} from 'meteor/meteor';

import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';

import {useSnackbar} from 'notistack';
import createUserWithPassword from '../../api/user/createUserWithPassword';

import {useStyles} from './Popover';

const RegisterPopover = ({anchorEl, handleClose, changeMode}) => {
	const classes = useStyles();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorUsername, setErrorUsername] = useState('');
	const [errorPassword, setErrorPassword] = useState('');

	const register = async (event) => {
		event.preventDefault();
		const key = enqueueSnackbar('Creating account...', {
			variant: 'info',
			persist: true,
		});
		return createUserWithPassword(username, password).then(
			() => {
				closeSnackbar(key);
				enqueueSnackbar('Welcome!', {variant: 'success'});
			},
			(error) => {
				closeSnackbar(key);
				const message =
					error instanceof Error ? error.message : 'unknown error';
				enqueueSnackbar(message, {variant: 'error'});
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
			className={classes.popover}
			id="register-popover"
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
					id="register-popover-input-username"
					error={Boolean(errorUsername)}
					helperText={errorUsername}
					className={classes.row}
					label="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<TextField
					id="register-popover-input-password"
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
					onClick={register}
				>
					Register
				</Button>
				<Button
					color="secondary"
					className={classes.row}
					onClick={() => changeMode('login')}
				>
					Already registered?
				</Button>
			</form>
		</Popover>
	);
};

RegisterPopover.propTypes = {
	anchorEl: PropTypes.object,
	handleClose: PropTypes.func.isRequired,
	changeMode: PropTypes.func.isRequired,
};

export default RegisterPopover;
