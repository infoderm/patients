import {Accounts} from 'meteor/accounts-base';

const createUserWithPassword = async (username: string, password: string) =>
	new Promise<void>((resolve, reject) => {
		Accounts.createUser({username, password}, (err) => {
			if (err) reject(err);
			else resolve();
		});
	});

export default createUserWithPassword;
