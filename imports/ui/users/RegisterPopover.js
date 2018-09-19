import { Accounts } from 'meteor/accounts-base';

import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

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

class RegisterPopover extends React.Component {

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

		const register = event => {
			event.preventDefault();
			Accounts.createUser({ username, password }, err => {
				if ( err ) {
					const { message , reason } = err;
					feedback(message);
					if ( reason === 'Need to set a username or email' ) {
						this.setState({ errorUsername: 'Please enter a username' , errorPassword: '' });
					}
					else if ( reason === 'Username already exists.' ) {
						this.setState({ errorUsername: reason , errorPassword: '' });
					}
					else if ( reason === 'Password may not be empty' ) {
						this.setState({ errorUsername: '' , errorPassword: reason });
					}
					else {
						this.setState({ errorUsername: '' , errorPassword: '' });
					}
				}
				else {
					feedback('Welcome!');
				}
			});
		} ;

		return (
			<Popover
				className={classes.popover}
				id="register-popover"
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
					<TextField error={!!errorPassword} helperText={errorPassword} className={classes.row} label="Password" type="password" value={password} onChange={e => this.setState({ password: e.target.value})}/>
					<Button type="submit" color="primary" className={classes.row} onClick={register}>Register</Button>
					<Button color="secondary" className={classes.row} onClick={e=>changeMode('login')}>Already registered?</Button>
				</form>
			</Popover>
		) ;
	}

}

RegisterPopover.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegisterPopover);
