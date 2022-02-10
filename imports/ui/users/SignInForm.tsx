import React, {useState} from 'react';

import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import LoginPopover from './LoginPopover';
import RegisterPopover from './RegisterPopover';

const SignInForm = () => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [mode, setMode] = useState('choice');

	const handleClick = (event) => {
		setMode('login');
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const changeMode = (newmode) => {
		setMode(newmode);
	};

	return (
		<div>
			<Button
				aria-owns={
					anchorEl
						? mode === 'login'
							? 'login-popover'
							: 'register-popover'
						: null
				}
				aria-haspopup="true"
				style={{color: 'inherit'}}
				endIcon={<AccountCircleIcon />}
				onClick={handleClick}
			>
				Sign in
			</Button>
			{mode === 'login' ? (
				<LoginPopover
					anchorEl={anchorEl}
					handleClose={handleClose}
					changeMode={changeMode}
				/>
			) : (
				<RegisterPopover
					anchorEl={anchorEl}
					handleClose={handleClose}
					changeMode={changeMode}
				/>
			)}
		</div>
	);
};

export default SignInForm;
