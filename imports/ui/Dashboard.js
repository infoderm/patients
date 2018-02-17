import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import React from 'react';

import List , { ListItem } from 'material-ui/List';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover';
import MoreVertIcon from 'material-ui-icons/MoreVert';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

class Logout extends React.Component {

	render ( ) {

		const logout = event => { Meteor.logout(); } ;

		return <ListItem button onClick={logout}>Logout</ListItem>

	}

}

class ChangePasswordForm extends React.Component {
	render ( ) {

		const changePassword = event => {
			event.preventDefault();
			const oldPassword = event.target.changePasswordOld.value;
			const newPassword = event.target.changePasswordNew.value;
			Accounts.changePassword(oldPassword, newPassword);
		} ;

		return (
			<form autoComplete="off">
				<TextField label="Old password" variant="password" name="changePasswordOld"/>
				<TextField label="New password" variant="password" name="changePasswordNew"/>
				<Button onClick={changePassword}>Change password</Button>
			</form>
		);
	}
}

class ChangePasswordPopover extends React.Component {

	render ( ) {
		const { anchorEl , handleClose } = this.props ;

		return (
			<Popover
				id="dashboard-options"
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
				<ChangePasswordForm/>
			</Popover>
		) ;
	}

}

class OptionsPopover extends React.Component {

	render ( ) {
		const { anchorEl , handleClose , changeMode } = this.props ;

		const handleModeChangePassword = () => {
			changeMode('change-password');
		} ;

		return (
			<Popover
				id="dashboard-options"
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
				<List>
					<ListItem button onClick={handleModeChangePassword}>Change password</ListItem>
					<Logout onClick={handleClose}>Logout</Logout>
				</List>
			</Popover>
		) ;
	}

}

const styles = theme => ({
	rightIcon: {
		marginLeft: theme.spacing.unit,
	},
});

class Dashboard extends React.Component {

	constructor ( props ) {
		super(props);
		this.state = {
			anchorEl: null ,
			mode: 'options' ,
		} ;
	}

	render() {

		const handleClick = event => {
			this.setState({ mode: 'options' , anchorEl: event.currentTarget });
		};

		const handleClose = () => {
			this.setState({ anchorEl: null });
		};

		const changeMode = newmode => {
			this.setState({ mode: newmode });
		};

		const { anchorEl , mode } = this.state;
		const { classes , currentUser } = this.props;

		return (
			<div>
				<Button
				aria-owns={anchorEl ? mode === 'options' ? 'dashboard-options' : 'dashboard-change-password' : null}
				aria-haspopup="true"
				onClick={handleClick}
				style={{color: 'inherit'}}
				>
				{currentUser.username}
				<MoreVertIcon className={classes.rightIcon}/>
				</Button>
				{ mode === 'options' ?
					<OptionsPopover anchorEl={anchorEl} handleClose={handleClose} changeMode={changeMode}/>
				:
					<ChangePasswordPopover anchorEl={anchorEl} handleClose={handleClose}/>
				}
			</div>
		);
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
