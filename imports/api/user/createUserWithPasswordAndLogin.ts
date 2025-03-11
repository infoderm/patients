import {Accounts} from 'meteor/accounts-base';

const createUserWithPasswordAndLogin = async (
	username: string,
	password: string,
): Promise<string> => Accounts.createUserAsync({username, password});

export default createUserWithPasswordAndLogin;
