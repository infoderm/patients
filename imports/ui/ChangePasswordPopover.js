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

class ChangePasswordPopover extends React.Component {

	constructor ( props ) {
		super(props);
		this.state = {
			oldPassword: '',
			newPassword: '',
		} ;
	}

	render ( ) {

		const { classes , anchorEl , handleClose } = this.props ;

		const { oldPassword , newPassword } = this.state ;

		const changePassword = event => {
			event.preventDefault();
			Accounts.changePassword(oldPassword, newPassword);
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
					<TextField autoFocus className={classes.row} label="Old password" variant="password" value={oldPassword} onChange={e => this.setState({ oldPassword: e.target.value})}/>
					<TextField className={classes.row} label="New password" variant="password" value={newPassword} onChange={e => this.setState({ newPassword: e.target.value})}/>
					<Button color="secondary" className={classes.row} onClick={changePassword}>Change password</Button>
				</form>
			</Popover>
		) ;
	}

}

ChangePasswordPopover.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChangePasswordPopover);
