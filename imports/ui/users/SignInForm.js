import React, {useState} from 'react';

import {makeStyles} from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import LoginPopover from './LoginPopover';
import RegisterPopover from './RegisterPopover';

const useStyles = makeStyles((theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
}));

const SignInForm = () => {
	const classes = useStyles();
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
				onClick={handleClick}
			>
				Sign in
				<AccountCircleIcon className={classes.rightIcon} />
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
