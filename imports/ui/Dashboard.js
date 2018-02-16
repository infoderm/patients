import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import React from 'react';

import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

class Logout extends React.Component {

	render ( ) {

		const logout = event => { Meteor.logout(); } ;

		return <MenuItem onClick={logout}>Logout</MenuItem>

	}

}

class ChangePassword extends React.Component {
	render ( ) {
		const changePassword = event => {
			event.preventDefault();
			const oldPassword = event.target.changePasswordOld.value;
			const newPassword = event.target.changePasswordNew.value;
			Accounts.changePassword(oldPassword, newPassword);
		} ;
		return (
			<template name="changePassword">
				<form>
					<input type="password" name="changePasswordOld"/>
					<input type="password" name="changePasswordNew"/>
					<input type="submit" value="Change password" onClick={changePassword}/>
				</form>
			</template>
		);
	}
}

const styles = theme => ({
	button: {
		margin: theme.spacing.unit,
	},
	leftIcon: {
		marginRight: theme.spacing.unit,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	},
});

class Dashboard extends React.Component {

	constructor ( props ) {
		super(props);
		this.state = {
			form: 'choice' ,
			anchorEl: null ,
		} ;
	}

	render() {

		const handleClick = event => {
			this.setState({ anchorEl: event.currentTarget });
		};

		const handleClose = () => {
			this.setState({ anchorEl: null });
		};

		const { anchorEl , form } = this.state;
		const { classes , currentUser } = this.props;

		//{this.state.form === 'choice' ? <span>change password or log out</span> : <span>change password form</span>};

		return (
			<div>
				<Button
				aria-owns={anchorEl ? 'simple-menu' : null}
				aria-haspopup="true"
				onClick={handleClick}
				style={{color: 'inherit'}}
				>
				{currentUser.username}
				<MoreVertIcon className={classes.rightIcon}/>
				</Button>
				<Menu
				id="simple-menu"
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
				>
				<Logout className={classes.button} onClick={handleClose}>Logout</Logout>
				</Menu>
			</div>
		);
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
