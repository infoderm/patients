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

class RegisterPopover extends React.Component {

	constructor ( props ) {
		super(props);
		this.state = {
			username: '',
			password: '',
		} ;
	}

	render ( ) {

		const { classes , anchorEl , handleClose } = this.props ;

		const { username , password } = this.state ;

		const register = event => {
			event.preventDefault();
			Accounts.createUser({ username, password });
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
					<TextField className={classes.row} label="Username" value={username} onChange={e => this.setState({ username: e.target.value})}/>
					<TextField className={classes.row} label="Password" variant="password" value={password} onChange={e => this.setState({ password: e.target.value})}/>
					<Button className={classes.row} onClick={register}>Register</Button>
				</form>
			</Popover>
		) ;
	}

}

RegisterPopover.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegisterPopover);
