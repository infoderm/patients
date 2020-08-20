import React, {useState} from 'react';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';

import CloseIcon from '@material-ui/icons/Close';

import Dashboard from './Dashboard.js';
import SignInForm from './SignInForm.js';

const useStyles = makeStyles(
	theme => ({
		close: {
			width: theme.spacing(4),
			height: theme.spacing(4),
		},
		snackbar: {
		},
	})
);

export default function AccountsUI ( { currentUser , ...rest } ) {

	const classes = useStyles();
	const [open, setOpen] = useState(false) ;
	const [message, setMessage] = useState('') ;

	const feedback = message => {
		setMessage(message);
		setOpen(true);
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') return;
		setOpen(false);
	};

	return (
		<div {...rest}>
			{ currentUser ? <Dashboard currentUser={currentUser} feedback={feedback}/> : <SignInForm feedback={feedback}/> }
			<Snackbar
				className={classes.snackbar}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				open={open}
				autoHideDuration={6000}
				onClose={handleClose}
				SnackbarContentProps={{
				'aria-describedby': 'account-ui-snackbar-message',
				}}
				message={<span id="account-ui-snackbar-message">{message}</span>}
				action={[
				<IconButton
					key="close"
					aria-label="Close"
					color="inherit"
					className={classes.close}
					onClick={handleClose}
				>
					<CloseIcon/>
					</IconButton>,
				]}
			/>
		</div>
	) ;

}
