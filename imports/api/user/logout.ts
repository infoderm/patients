import {Meteor} from 'meteor/meteor';

const logout = async () =>
	new Promise<void>((resolve, reject) => {
		Meteor.logout((err) => {
			if (err) reject(err);
			else resolve();
		});
	});

export default logout;
