import { Accounts } from 'meteor/accounts-base';

import React from 'react';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
	popover: {
		display: 'flex',
	},
	row: {
		display: 'block',
		margin: theme.spacing.unit,
		width: 200,
	},
	form: {
		display: 'block',
	}
});

class LoginPopover extends React.Component {

	constructor ( props ) {
		super(props);
		this.state = {
			username: '',
			password: '',
			errorUsername: '',
			errorPassword: '',
		} ;
	}

	render ( ) {

		const { classes , anchorEl , handleClose , changeMode , feedback } = this.props ;

		const { username , password , errorUsername , errorPassword } = this.state ;

		const login = event => {
			event.preventDefault();
			Meteor.loginWithPassword(username, password, err => {
				if ( err ) {
					const { message , reason } = err;
					feedback(message);
					if ( reason === 'User not found' ) {
						this.setState({ errorUsername: reason , errorPassword: '' });
					}
					else if ( reason === 'Match failed' ) {
						this.setState({ errorUsername: 'Please enter a username' , errorPassword: '' });
					}
					else if ( reason === 'Incorrect password' ) {
						this.setState({ errorUsername: '' , errorPassword: reason });
					}
					else {
						this.setState({ errorUsername: '' , errorPassword: '' });
					}
				}
				else {
					feedback('Welcome back!');
				}
			});
		} ;

		return (
			<Popover
				className={classes.popover}
				id="dashboard-change-password"
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				<form className={classes.form} autoComplete="off">
					<TextField error={!!errorUsername} helperText={errorUsername} autoFocus className={classes.row} label="Username" value={username} onChange={e => this.setState({ username: e.target.value})}/>
					<TextField error={!!errorPassword} helperText={errorPassword} className={classes.row} label="Password" variant="password" value={password} onChange={e => this.setState({ password: e.target.value})}/>
					<Button type="submit" color="primary" className={classes.row} onClick={login}>Log in</Button>
					<Button color="secondary" className={classes.row} onClick={e=>changeMode('register')}>Create account?</Button>
				</form>
			</Popover>
		) ;
	}

}

LoginPopover.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginPopover);
