import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import Menu , { MenuItem } from 'material-ui/Menu';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';

import LoginPopover from './LoginPopover.js' ;
import RegisterPopover from './RegisterPopover.js' ;

class OptionsPopover extends React.Component {

	render ( ) {

		const { anchorEl , handleClose , changeMode } = this.props ;

		return (
			<Menu
				id="sign-in-options"
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				<MenuItem onClick={e=>changeMode('login')}>Login</MenuItem>
				<MenuItem onClick={e=>changeMode('register')}>Register</MenuItem>
			</Menu>
		) ;
	}

}

class SignInForm extends React.Component {

	constructor ( props ) {
		super(props);
		this.state = {
			anchorEl: null ,
			mode: 'choice' ,
		} ;
	}

	render ( ) {

		const { classes } = this.props ;
		const { anchorEl , mode } = this.state ;

		const handleClick = event => {
			this.setState({ mode: 'choice' , anchorEl: event.currentTarget });
		};

		const handleClose = () => {
			this.setState({ anchorEl: null });
		};

		const changeMode = newmode => {
			this.setState({ mode: newmode });
		};

		return (
			<div>
				<Button
				aria-owns={anchorEl ? mode === 'choice' ? 'sign-in-options' : mode === 'login' ? 'login-popover' : 'register-popover' : null}
				aria-haspopup="true"
				onClick={handleClick}
				style={{color: 'inherit'}}
				>
					Sign in
					<AccountCircleIcon className={classes.rightIcon}/>
				</Button>
				{ mode === 'choice' ?
					<OptionsPopover anchorEl={anchorEl} handleClose={handleClose} changeMode={changeMode}/>
				: mode === 'login' ?
					<LoginPopover anchorEl={anchorEl} handleClose={handleClose}/>
				:
					<RegisterPopover anchorEl={anchorEl} handleClose={handleClose}/>
				}
			</div>
		) ;
	}

}

const styles = theme => ({
	rightIcon: {
		marginLeft: theme.spacing.unit,
	},
});

SignInForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignInForm) ;
