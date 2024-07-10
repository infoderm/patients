import {Accounts} from 'meteor/accounts-base';

const createUserWithPassword = async (
	username: string,
	password: string,
): Promise<string> => Accounts.createUserAsync({username, password});

export default createUserWithPassword;
