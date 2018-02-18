import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';

import CloseIcon from 'material-ui-icons/Close';

import Dashboard from './Dashboard.js';
import SignInForm from './SignInForm.js';

class AccountsUI extends React.Component {

	constructor ( props ) {
		super(props);
		this.state = {
			open: false,
			message: '',
		};
	}

	render ( ) {

		const { currentUser , classes } = this.props ;

		const { open , message } = this.state ;

		const feedback = message => {
			this.setState({ open: true, message });
		};

		const handleClose = (event, reason) => {
			if (reason === 'clickaway') return;
			this.setState({ open: false });
		};

		return (
			<div>
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

}


const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
  snackbar: {
  },
});

AccountsUI.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AccountsUI);
