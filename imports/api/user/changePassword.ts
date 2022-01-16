import {Accounts} from 'meteor/accounts-base';

const changePassword = async (oldPassword: string, newPassword: string) =>
	new Promise<void>((resolve, reject) => {
		Accounts.changePassword(oldPassword, newPassword, (err) => {
			if (err) reject(err);
			else resolve();
		});
	});

export default changePassword;
