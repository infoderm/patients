import {Meteor} from 'meteor/meteor';

import React, {useState} from 'react';

import {useSnackbar} from 'notistack';
import changePassword from '../../api/user/changePassword';

import debounceSnackbar from '../../util/debounceSnackbar';
import {Popover, Form, RowTextField, RowButton} from './Popover';

type Props = {
	id: string;
	anchorEl: HTMLElement;
	handleClose: () => void;
};

const ChangePasswordPopover = ({id, anchorEl, handleClose}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [errorOldPassword, setErrorOldPassword] = useState('');
	const [errorNewPassword, setErrorNewPassword] = useState('');

	const uiChangePassword = async (event) => {
		event.preventDefault();
		const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
		feedback('Changing password...', {
			variant: 'info',
			persist: true,
		});
		return changePassword(oldPassword, newPassword).then(
			() => {
				const message = 'Password changed successfully!';
				feedback(message, {variant: 'success'});
				setErrorOldPassword('');
				setErrorNewPassword('');
				handleClose();
			},
			(error) => {
				const message =
					error instanceof Error ? error.message : 'unknown error';
				feedback(message, {variant: 'error'});
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
