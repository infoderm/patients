import React, {useRef, useState} from 'react';

import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import LoginPopover from './LoginPopover';
import RegisterPopover from './RegisterPopover';
import useUniqueId from '../hooks/useUniqueId';

const SignInForm = () => {
	const anchorRef = useRef(null);
	const anchorEl = anchorRef.current;
	const [mode, setMode] = useState('choice');

	const handleClick = () => {
		setMode('login');
	};

	const changeMode = (newMode: 'choice' | 'login' | 'register') => {
		setMode(newMode);
	};

	const handleClose = () => {
		setMode('choice');
	};

	const signInFormId = useUniqueId('signInForm');
	const loginPopoverId = `${signInFormId}-login`;
	const registerPopoverId = `${signInFormId}-register`;

	return (
		<div>
			<Button
				ref={anchorRef}
				aria-owns={
					anchorEl === null
						? undefined
						: mode === 'login'
							? 'login-popover'
							: 'register-popover'
				}
				aria-haspopup="true"
				style={{color: 'inherit'}}
				endIcon={<AccountCircleIcon />}
				onClick={handleClick}
			>
				Sign in
			</Button>
			{anchorEl !== null && mode === 'login' && (
				<LoginPopover
					id={loginPopoverId}
					anchorEl={anchorEl}
					open={true}
					changeMode={changeMode}
					handleClose={handleClose}
				/>
			)}
			{anchorEl !== null && mode === 'register' && (
				<RegisterPopover
					id={registerPopoverId}
					anchorEl={anchorEl}
					open={true}
					changeMode={changeMode}
					handleClose={handleClose}
				/>
			)}
		</div>
	);
};

export default SignInForm;
