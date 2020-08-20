import {Meteor} from 'meteor/meteor';

import React from 'react';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import ChangePasswordPopover from './ChangePasswordPopover.js';

class Logout extends React.Component {
	render() {
		const {feedback} = this.props;

		const logout = () => {
			Meteor.logout((err) => {
				feedback(err ? err.message : 'See you soon!');
			});
		};

		return <MenuItem onClick={logout}>Logout</MenuItem>;
	}
}

class OptionsPopover extends React.Component {
	render() {
		const {anchorEl, handleClose, changeMode, feedback} = this.props;

		const handleModeChangePassword = () => {
			changeMode('change-password');
		};

		return (
			<Menu
				id="dashboard-options"
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				<MenuItem onClick={handleModeChangePassword}>Change password</MenuItem>
				<Logout feedback={feedback} onClick={handleClose}>
					Logout
				</Logout>
			</Menu>
		);
	}
}

const styles = (theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
});

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			anchorEl: null,
			mode: 'options'
		};
	}

	render() {
		const {anchorEl, mode} = this.state;
		const {classes, currentUser, feedback} = this.props;

		const handleClick = (event) => {
			this.setState({mode: 'options', anchorEl: event.currentTarget});
		};

		const handleClose = () => {
			this.setState({anchorEl: null});
		};

		const changeMode = (newmode) => {
			this.setState({mode: newmode});
		};

		return (
			<div>
				<Button
					aria-owns={
						anchorEl
							? mode === 'options'
								? 'dashboard-options'
								: 'dashboard-change-password'
							: null
					}
					aria-haspopup="true"
					style={{color: 'inherit'}}
					onClick={handleClick}
				>
					Logged in as {currentUser.username}
					<AccountCircleIcon className={classes.rightIcon} />
				</Button>
				{mode === 'options' ? (
					<OptionsPopover
						anchorEl={anchorEl}
						handleClose={handleClose}
						changeMode={changeMode}
						feedback={feedback}
					/>
				) : (
					<ChangePasswordPopover
						anchorEl={anchorEl}
						handleClose={handleClose}
						feedback={feedback}
					/>
				)}
			</div>
		);
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);
