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

class ChangePasswordPopover extends React.Component {

	constructor ( props ) {
		super(props);
		this.state = {
			oldPassword: '',
			newPassword: '',
			errorOldPassword: '',
			errorNewPassword: '',
		} ;
	}

	render ( ) {

		const { classes , anchorEl , handleClose , feedback } = this.props ;

		const { oldPassword , newPassword , errorOldPassword , errorNewPassword } = this.state ;

		const changePassword = event => {
			event.preventDefault();
			Accounts.changePassword(oldPassword, newPassword, err => {
				if ( err ) {
					const { message , reason } = err;
					feedback(message);
					if ( reason === 'Incorrect password' ) {
						this.setState({ errorOldPassword: reason , errorNewPassword: '' });
					}
					else if ( reason === 'Password may not be empty' ) {
						this.setState({ errorOldPassword: '' , errorNewPassword: reason });
					}
					else {
						this.setState({ errorOldPassword: '' , errorNewPassword: '' });
					}
				}
				else {
					feedback( 'Password changed successfully!' );
					this.setState({ errorOldPassword: '' , errorNewPassword: '' });
					handleClose();
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
					<TextField error={!!errorOldPassword} helperText={errorOldPassword} autoFocus className={classes.row} label="Old password" type="password" value={oldPassword} onChange={e => this.setState({ oldPassword: e.target.value})}/>
					<TextField error={!!errorNewPassword} helperText={errorNewPassword} className={classes.row} label="New password" type="password" value={newPassword} onChange={e => this.setState({ newPassword: e.target.value})}/>
					<Button type="submit" color="secondary" className={classes.row} onClick={changePassword}>Change password</Button>
				</form>
			</Popover>
		) ;
	}

}

ChangePasswordPopover.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChangePasswordPopover);
