import {Meteor} from 'meteor/meteor';

import React, {useState} from 'react';

import {useSnackbar} from 'notistack';
import changePassword from '../../api/user/changePassword';

import useUniqueId from '../hooks/useUniqueId';
import {Popover, Form, RowTextField, RowButton} from './Popover';

interface Props {
	anchorEl: HTMLElement;
	handleClose: () => void;
}

const ChangePasswordPopover = ({anchorEl, handleClose}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [errorOldPassword, setErrorOldPassword] = useState('');
	const [errorNewPassword, setErrorNewPassword] = useState('');

	const id = useUniqueId('dashboard-change-password');

	const oldPasswordInputId = `${id}-input-old-password`;
	const newPasswordInputId = `${id}-input-new-password`;

	const uiChangePassword = async (event) => {
		event.preventDefault();
		const key = enqueueSnackbar('Changing password...', {
			variant: 'info',
			persist: true,
		});
		return changePassword(oldPassword, newPassword).then(
			() => {
				closeSnackbar(key);
				const message = 'Password changed successfully!';
				enqueueSnackbar(message, {variant: 'success'});
				setErrorOldPassword('');
				setErrorNewPassword('');
				handleClose();
			},
			(error) => {
				closeSnackbar(key);
				const message =
					error instanceof Error ? error.message : 'unknown error';
				enqueueSnackbar(message, {variant: 'error'});
				const reason = error instanceof Meteor.Error ? error.reason : undefined;
				if (reason === 'Incorrect password' || reason === 'Match failed') {
					setErrorOldPassword('Incorrect password');
					setErrorNewPassword('');
				} else if (reason === 'Password may not be empty') {
					setErrorOldPassword('');
					setErrorNewPassword(reason);
				} else {
					setErrorOldPassword('');
					setErrorNewPassword('');
				}
			},
		);
	};

	return (
		<Popover
			id={id}
			anchorEl={anchorEl}
			open={Boolean(anchorEl)}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			onClose={handleClose}
		>
			<Form autoComplete="off">
				<RowTextField
					autoFocus
					id={oldPasswordInputId}
					error={Boolean(errorOldPassword)}
					helperText={errorOldPassword}
					label="Old password"
					type="password"
					value={oldPassword}
					onChange={(e) => {
						setOldPassword(e.target.value);
					}}
				/>
				<RowTextField
					id={newPasswordInputId}
					error={Boolean(errorNewPassword)}
					helperText={errorNewPassword}
					label="New password"
					type="password"
					value={newPassword}
					onChange={(e) => {
						setNewPassword(e.target.value);
					}}
				/>
				<RowButton type="submit" color="secondary" onClick={uiChangePassword}>
					Change password
				</RowButton>
			</Form>
		</Popover>
	);
};

export default ChangePasswordPopover;
