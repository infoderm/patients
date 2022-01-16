import {Meteor} from 'meteor/meteor';

const loginWithPassword = async (username: string, password: string) =>
	new Promise<void>((resolve, reject) => {
		Meteor.loginWithPassword(username, password, (err) => {
			if (err) reject(err);
			else resolve();
		});
	});

export default loginWithPassword;
